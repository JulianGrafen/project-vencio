import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus, SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import { SMART_FILL_CONFIRM_KEYWORDS } from "./constants";
import { normalizePhoneNumber } from "./phone-utils";

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
    const normalizedPhone = normalizePhoneNumber(payload.from);
    const normalizedBody = payload.body.trim().toUpperCase();

    const patient = await this.prisma.smartFillPatient.findFirst({
      where: {
        OR: [{ phoneNumber: normalizedPhone }, { phoneNumber: payload.from.replace(/\s+/g, "") }],
      },
    });

    if (!patient) {
      return { action: "ignored", reason: "unknown_patient" };
    }

    const invite = await this.prisma.smartFillInvite.findFirst({
      where: {
        patientId: patient.id,
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

    if (!invite) {
      return { action: "ignored", reason: "no_active_invite" };
    }

    if (SMART_FILL_CONFIRM_KEYWORDS.includes(normalizedBody as (typeof SMART_FILL_CONFIRM_KEYWORDS)[number])) {
      return this.confirmInvite(invite, payload.body);
    }

    if (["NEIN", "N", "NO"].includes(normalizedBody)) {
      await this.prisma.smartFillInvite.update({
        where: { id: invite.id },
        data: { status: SmartFillInviteStatus.REPLIED_NO, repliedAt: new Date(), replyBody: payload.body },
      });
      await this.prisma.smartFillTask.update({
        where: { id: invite.taskId },
        data: { status: SmartFillTaskStatus.DECLINED },
      });
      return { action: "declined", taskId: invite.taskId };
    }

    return { action: "ignored", reason: "unrecognized_reply" };
  }

  private async confirmInvite(
    invite: {
      id: string;
      taskId: string;
      patient: {
        id: string;
        email: string;
        name: string;
        locale: string | null;
      };
      task: {
        id: string;
        teamId: number;
        userId: number;
        eventTypeId: number | null;
        startTime: Date;
        endTime: Date;
        user: { email: string; name: string | null; timeZone: string };
        eventType: { title: string } | null;
      };
    },
    replyBody: string
  ): Promise<SmartFillReplyResult> {
    const { patient } = invite;
    const bookingUid = randomUUID();

    const result = await this.prisma.$transaction(async (tx) => {
      const locked = await tx.smartFillTask.updateMany({
        where: { id: invite.taskId, status: SmartFillTaskStatus.INVITED },
        data: { status: SmartFillTaskStatus.CONFIRMED, bookingUid },
      });

      if (locked.count === 0) {
        const existing = await tx.smartFillTask.findUnique({ where: { id: invite.taskId } });
        if (existing?.status === SmartFillTaskStatus.CONFIRMED && existing.bookingUid) {
          return { alreadyConfirmed: true as const, bookingUid: existing.bookingUid };
        }
        throw new Error(`SmartFillTask ${invite.taskId} is no longer invitable`);
      }

      await tx.booking.create({
        data: {
          uid: bookingUid,
          title: invite.task.eventType?.title ?? "Smart-Fill Termin",
          startTime: invite.task.startTime,
          endTime: invite.task.endTime,
          userId: invite.task.userId,
          eventTypeId: invite.task.eventTypeId,
          status: BookingStatus.ACCEPTED,
          metadata: { source: "smart-fill", smartFillTaskId: invite.task.id },
          attendees: {
            create: {
              email: patient.email,
              name: patient.name,
              timeZone: invite.task.user.timeZone,
              locale: patient.locale ?? "de",
            },
          },
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

      return { alreadyConfirmed: false as const, bookingUid };
    });

    return { action: "confirmed", bookingUid: result.bookingUid, taskId: invite.taskId };
  }
}
