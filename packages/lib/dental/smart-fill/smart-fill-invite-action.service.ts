import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import { enqueueBookingPvsSyncIfEnabled } from "../pvs/enqueue-booking-pvs-sync";
import { finalizeSmartFillBooking } from "./smart-fill-booking-finalizer";
import { SMART_FILL_BOOKING_SOURCE, SMART_FILL_DEFAULT_BOOKING_TITLE } from "./constants";
import { declineSmartFillInvite } from "./smart-fill-invite-lifecycle";
import type { SmartFillActiveInvite } from "./smart-fill-reply.types";
import { parseSmartFillTaskMetadata } from "./smart-fill-slot-hold";

export type SmartFillInviteActionResult =
  | { success: true; action: "confirmed"; bookingUid: string; patientName: string }
  | { success: true; action: "declined"; patientName: string }
  | { success: false; reason: "invalid_token" | "expired" | "already_handled" };

const INVITE_INCLUDE = {
  patient: true,
  task: { include: { user: true, eventType: true, team: { select: { name: true } } } },
} as const;

/**
 * Confirms or declines Smart-Fill invites via email one-click links (confirmToken).
 */
export class SmartFillInviteActionService {
  constructor(private readonly prisma: PrismaClient) {}

  async confirmByToken(token: string): Promise<SmartFillInviteActionResult> {
    const invite = await this.loadActiveInvite(token);
    if (!invite) {
      return { success: false, reason: "invalid_token" };
    }

    if (invite.task.status === SmartFillTaskStatus.CONFIRMED && invite.task.bookingUid) {
      return {
        success: false,
        reason: "already_handled",
      };
    }

    if (invite.task.startTime <= new Date()) {
      return { success: false, reason: "expired" };
    }

    try {
      const bookingUid = await this.confirmInvite(invite, "email-confirm");
      return {
        success: true,
        action: "confirmed",
        bookingUid,
        patientName: invite.patient.name,
      };
    } catch {
      return { success: false, reason: "invalid_token" };
    }
  }

  async declineByToken(token: string): Promise<SmartFillInviteActionResult> {
    const invite = await this.loadActiveInvite(token);
    if (!invite) {
      return { success: false, reason: "invalid_token" };
    }

    if (invite.status === SmartFillInviteStatus.REPLIED_NO) {
      return { success: false, reason: "already_handled" };
    }

    await declineSmartFillInvite(this.prisma, {
      inviteId: invite.id,
      taskId: invite.taskId,
      taskMetadata: invite.task.metadata,
      replyBody: "email-decline",
    });

    return { success: true, action: "declined", patientName: invite.patient.name };
  }

  private async loadActiveInvite(token: string) {
    return this.prisma.smartFillInvite.findFirst({
      where: {
        confirmToken: token,
        status: { in: [SmartFillInviteStatus.SENT, SmartFillInviteStatus.DELIVERED] },
        task: { status: SmartFillTaskStatus.INVITED },
      },
      include: INVITE_INCLUDE,
    });
  }

  private async confirmInvite(invite: SmartFillActiveInvite, replyBody: string): Promise<string> {
    const { patient } = invite;
    const holdBookingUid = parseSmartFillTaskMetadata(invite.task.metadata).holdBookingUid;
    const bookingUid = holdBookingUid ?? randomUUID();

    const result = await this.prisma.$transaction(async (tx) => {
      const locked = await tx.smartFillTask.updateMany({
        where: { id: invite.taskId, status: SmartFillTaskStatus.INVITED },
        data: { status: SmartFillTaskStatus.CONFIRMED, bookingUid },
      });

      if (locked.count === 0) {
        const existing = await tx.smartFillTask.findUnique({ where: { id: invite.taskId } });
        if (existing?.status === SmartFillTaskStatus.CONFIRMED && existing.bookingUid) {
          return { bookingUid: existing.bookingUid };
        }
        throw new Error(`SmartFillTask ${invite.taskId} is no longer invitable`);
      }

      await finalizeSmartFillBooking(tx, {
        bookingUid,
        holdBookingUid,
        task: {
          id: invite.task.id,
          teamId: invite.task.teamId,
          userId: invite.task.userId,
          eventTypeId: invite.task.eventTypeId,
          startTime: invite.task.startTime,
          endTime: invite.task.endTime,
          eventTypeTitle: invite.task.eventType?.title,
        },
        patient: {
          email: patient.email,
          name: patient.name,
          timeZone: invite.task.user.timeZone,
          locale: patient.locale,
        },
      });

      await tx.smartFillInvite.update({
        where: { id: invite.id },
        data: {
          status: SmartFillInviteStatus.REPLIED_YES,
          repliedAt: new Date(),
          replyBody,
        },
      });

      await tx.smartFillPatient.update({
        where: { id: patient.id },
        data: { lastVisitAt: invite.task.startTime },
      });

      const title = invite.task.eventType?.title ?? SMART_FILL_DEFAULT_BOOKING_TITLE;
      await enqueueBookingPvsSyncIfEnabled(tx, {
        bookingUid,
        teamId: invite.task.teamId,
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phoneNumber,
        startTime: invite.task.startTime,
        endTime: invite.task.endTime,
        title,
        eventTypeId: invite.task.eventTypeId,
        source: SMART_FILL_BOOKING_SOURCE,
        smartFillTaskId: invite.task.id,
      });

      return { bookingUid };
    });

    return result.bookingUid;
  }
}
