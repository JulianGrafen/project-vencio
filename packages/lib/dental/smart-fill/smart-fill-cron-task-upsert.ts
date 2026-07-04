import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import type { SmartFillCronHost } from "./smart-fill-cron-host-loader";

export async function upsertSmartFillTask(
  prisma: PrismaClient,
  host: SmartFillCronHost,
  slot: { start: Date; end: Date },
  scanRunId: string
): Promise<{ task: { id: string; status: SmartFillTaskStatus }; created: boolean }> {
  const durationMinutes = dayjs(slot.end).diff(dayjs(slot.start), "minute");

  const existing = await prisma.smartFillTask.findUnique({
    where: {
      teamId_userId_startTime_endTime: {
        teamId: host.teamId,
        userId: host.userId,
        startTime: slot.start,
        endTime: slot.end,
      },
    },
  });

  if (existing) {
    return { task: existing, created: false };
  }

  const task = await prisma.smartFillTask.create({
    data: {
      teamId: host.teamId,
      userId: host.userId,
      eventTypeId: host.eventTypeId,
      startTime: slot.start,
      endTime: slot.end,
      durationMinutes,
      status: SmartFillTaskStatus.PENDING,
      estimatedRevenueCents: host.revenueCents,
      scanRunId,
    },
  });

  return { task, created: true };
}
