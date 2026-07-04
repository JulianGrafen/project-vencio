import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

import {
  isSmartFillConfirmKeyword,
  isSmartFillDeclineKeyword,
} from "./constants";
import { declineSmartFillInvite } from "./smart-fill-invite-lifecycle";
import { confirmSmartFillInvite } from "./smart-fill-invite-confirm";
import { buildSmartFillPatientPhoneLookupConditions } from "./smart-fill-patient-phone-index";
import type { SmartFillActiveInvite } from "./smart-fill-reply.types";

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
      const bookingUid = await confirmSmartFillInvite(this.prisma, invite, payload.body);
      return { action: "confirmed", bookingUid, taskId: invite.taskId };
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
  private async findActiveInviteByPhone(from: string): Promise<SmartFillActiveInvite | null> {
    const activeInviteWhere = {
      status: { in: [SmartFillInviteStatus.SENT, SmartFillInviteStatus.DELIVERED] },
      task: {
        status: SmartFillTaskStatus.INVITED,
        startTime: { gt: new Date() },
      },
    };

    const phoneConditions = await buildSmartFillPatientPhoneLookupConditions(
      this.prisma,
      from,
      activeInviteWhere
    );

    if (phoneConditions.length === 0) {
      return null;
    }

    return this.prisma.smartFillInvite.findFirst({
      where: {
        ...activeInviteWhere,
        patient: {
          OR: phoneConditions.map(({ teamId, phoneBlindIndex }) => ({
            teamId,
            phoneBlindIndex,
          })),
        },
      },
      orderBy: { sentAt: "desc" },
      include: {
        patient: true,
        task: { include: { user: true, eventType: true } },
      },
    });
  }
}
