import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { enqueuePvsAppointmentSync } from "@calcom/lib/dental/pvs/enqueue-pvs-sync";
import { randomUUID } from "node:crypto";

import { finalizeSmartFillBooking } from "./smart-fill-booking-finalizer";
import {
  isSmartFillConfirmKeyword,
  isSmartFillDeclineKeyword,
  SMART_FILL_DEFAULT_BOOKING_TITLE,
} from "./constants";
import { declineSmartFillInvite } from "./smart-fill-invite-lifecycle";
import { normalizePhoneNumber } from "./phone-utils";
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
    const patient = await this.findPatientByPhone(payload.from);
    if (!patient) {
      return { action: "ignored", reason: "unknown_patient" };
    }

    const invite = await this.findActiveInvite(patient.id);
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

  private findPatientByPhone(from: string) {
    const normalizedPhone = normalizePhoneNumber(from);

    return this.prisma.smartFillPatient.findFirst({
      where: {
        OR: [{ phoneNumber: normalizedPhone }, { phoneNumber: from.replace(/\s+/g, "") }],
      },
    });
  }

  private findActiveInvite(patientId: string) {
    return this.prisma.smartFillInvite.findFirst({
      where: {
        patientId,
        status: { in: [SmartFillInviteStatus.SENT, SmartFillInviteStatus.DELIVERED] },
        task: {
          status: SmartFillTaskStatus.INVITED,
          startTime: { gt: new Date() },
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
    invite: {
      id: string;
      taskId: string;
      patient: {
        id: string;
        email: string;
        name: string;
        phoneNumber: string;
        locale: string | null;
      };
      task: {
        id: string;
        teamId: number;
        userId: number;
        eventTypeId: number | null;
        startTime: Date;
        endTime: Date;
        metadata: unknown;
        user: { email: string; name: string | null; timeZone: string };
        eventType: { title: string } | null;
      };
    },
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
      await enqueuePvsAppointmentSync(tx, {
        bookingUid,
        teamId: invite.task.teamId,
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phoneNumber,
        startTime: invite.task.startTime.toISOString(),
        endTime: invite.task.endTime.toISOString(),
        title,
        eventTypeId: invite.task.eventTypeId,
        source: "smart-fill",
        smartFillTaskId: invite.task.id,
      });

      return { bookingUid };
    });

    return { action: "confirmed", bookingUid: result.bookingUid, taskId: invite.taskId };
  }
}
