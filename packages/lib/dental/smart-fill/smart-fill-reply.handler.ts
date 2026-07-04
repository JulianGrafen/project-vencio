import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { enqueueBookingPvsSyncIfEnabled } from "@calcom/lib/dental/pvs/enqueue-booking-pvs-sync";
import { randomUUID } from "node:crypto";

import { finalizeSmartFillBooking } from "./smart-fill-booking-finalizer";
import {
  isSmartFillConfirmKeyword,
  isSmartFillDeclineKeyword,
  SMART_FILL_BOOKING_SOURCE,
  SMART_FILL_DEFAULT_BOOKING_TITLE,
} from "./constants";
import { declineSmartFillInvite } from "./smart-fill-invite-lifecycle";
import { normalizePhoneNumber } from "./phone-utils";
import type { SmartFillActiveInvite } from "./smart-fill-reply.types";
import { parseSmartFillTaskMetadata } from "./smart-fill-slot-hold";

export type InboundSmsPayload = {
  from: string;
  body: string;
  messageSid?: string;
};

export type SmartFillReplyResult =
  | { action: "ignored"; reason: string }
  | { action: "confirmed"; bookingUid: string; taskId: string }
  | { action: "declined"; taskId: string };

/**
 * Handles inbound SMS/WhatsApp replies and finalizes bookings on confirmation.
 */
export class SmartFillReplyHandler {
  constructor(private readonly prisma: PrismaClient) {}

  async handleInboundSms(payload: InboundSmsPayload): Promise<SmartFillReplyResult> {
    const invite = await this.findActiveInviteByPhone(payload.from);
    if (!invite) {
      return { action: "ignored", reason: "no_active_invite" };
    }

    if (isSmartFillConfirmKeyword(payload.body)) {
      return this.confirmInvite(invite, payload.body);
    }

    if (isSmartFillDeclineKeyword(payload.body)) {
      await declineSmartFillInvite(this.prisma, {
        inviteId: invite.id,
        taskId: invite.taskId,
        taskMetadata: invite.task.metadata,
        replyBody: payload.body,
      });
      return { action: "declined", taskId: invite.taskId };
    }

    return { action: "ignored", reason: "unrecognized_reply" };
  }

  /** Resolves invite by phone via active invite chain — avoids cross-team patient mismatch. */
  private findActiveInviteByPhone(from: string): Promise<SmartFillActiveInvite | null> {
    const normalizedPhone = normalizePhoneNumber(from);
    const compactPhone = from.replace(/\s+/g, "");

    return this.prisma.smartFillInvite.findFirst({
      where: {
        status: { in: [SmartFillInviteStatus.SENT, SmartFillInviteStatus.DELIVERED] },
        task: {
          status: SmartFillTaskStatus.INVITED,
          startTime: { gt: new Date() },
        },
        patient: {
          OR: [{ phoneNumber: normalizedPhone }, { phoneNumber: compactPhone }],
        },
      },
      orderBy: { sentAt: "desc" },
      include: {
        patient: true,
        task: { include: { user: true, eventType: true } },
      },
    });
  }

  private async confirmInvite(
    invite: SmartFillActiveInvite,
    replyBody: string
  ): Promise<SmartFillReplyResult> {
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

    return { action: "confirmed", bookingUid: result.bookingUid, taskId: invite.taskId };
  }
}
