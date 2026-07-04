import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

import { declineSmartFillInvite } from "./smart-fill-invite-lifecycle";
import { confirmSmartFillInvite } from "./smart-fill-invite-confirm";

export type SmartFillInviteActionResult =
  | { success: true; action: "confirmed"; bookingUid: string; patientName: string }
  | { success: true; action: "declined"; patientName: string }
  | { success: false; reason: "invalid_token" | "expired" | "already_handled" };

const INVITE_INCLUDE = {
  patient: true,
  task: { include: { user: true, eventType: true } },
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
      const bookingUid = await confirmSmartFillInvite(this.prisma, invite, "email-confirm");
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
}
