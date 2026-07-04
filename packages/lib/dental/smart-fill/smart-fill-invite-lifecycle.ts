import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

import { SMART_FILL_DEFAULT_TREATMENT_TITLE } from "./constants";
import { createSmartFillHoldBooking, releaseSmartFillHoldBooking } from "./smart-fill-slot-hold";

type InviteLockHost = {
  teamId: number;
  userId: number;
  eventTypeId: number | null;
  eventTypeTitle: string | null;
};

type InviteLockResult = {
  task: { id: string; startTime: Date; endTime: Date; metadata: unknown };
  inviteId: string;
};

export async function lockSmartFillTaskForInvite(
  tx: Pick<PrismaClient, "smartFillTask" | "smartFillInvite" | "booking">,
  params: {
    taskId: string;
    patientId: string;
    host: InviteLockHost;
  }
): Promise<InviteLockResult | null> {
  const locked = await tx.smartFillTask.updateMany({
    where: { id: params.taskId, status: SmartFillTaskStatus.PENDING },
    data: { status: SmartFillTaskStatus.INVITED },
  });

  if (locked.count === 0) {
    return null;
  }

  const task = await tx.smartFillTask.findUniqueOrThrow({ where: { id: params.taskId } });
  const existingInvites = await tx.smartFillInvite.count({ where: { taskId: params.taskId } });

  if (existingInvites > 0) {
    return null;
  }

  await createSmartFillHoldBooking(tx, {
    taskId: task.id,
    teamId: params.host.teamId,
    userId: params.host.userId,
    eventTypeId: params.host.eventTypeId,
    title: params.host.eventTypeTitle ?? SMART_FILL_DEFAULT_TREATMENT_TITLE,
    startTime: task.startTime,
    endTime: task.endTime,
  });

  const invite = await tx.smartFillInvite.create({
    data: {
      taskId: task.id,
      patientId: params.patientId,
      status: SmartFillInviteStatus.SENT,
    },
  });

  return { task, inviteId: invite.id };
}

export async function rollbackSmartFillInvite(
  tx: Pick<PrismaClient, "smartFillInvite" | "smartFillTask" | "booking">,
  params: { taskId: string; inviteId: string; taskMetadata: unknown }
): Promise<void> {
  await tx.smartFillInvite.delete({ where: { id: params.inviteId } });
  await releaseSmartFillHoldBooking(tx, params.taskId, params.taskMetadata);
  await tx.smartFillTask.update({
    where: { id: params.taskId },
    data: { status: SmartFillTaskStatus.PENDING, metadata: {} },
  });
}

export async function declineSmartFillInvite(
  prisma: Pick<PrismaClient, "smartFillInvite" | "smartFillTask" | "booking">,
  params: { inviteId: string; taskId: string; taskMetadata: unknown; replyBody: string }
): Promise<void> {
  await prisma.smartFillInvite.update({
    where: { id: params.inviteId },
    data: {
      status: SmartFillInviteStatus.REPLIED_NO,
      repliedAt: new Date(),
      replyBody: params.replyBody,
    },
  });
  await releaseSmartFillHoldBooking(prisma, params.taskId, params.taskMetadata);
  await prisma.smartFillTask.update({
    where: { id: params.taskId },
    data: { status: SmartFillTaskStatus.DECLINED, metadata: {} },
  });
}
