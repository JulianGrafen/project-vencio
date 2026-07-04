import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { SMART_FILL_HOLD_SOURCE } from "./constants";

export type SmartFillTaskMetadata = {
  holdBookingUid?: string;
};

export function parseSmartFillTaskMetadata(metadata: unknown): SmartFillTaskMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const record = metadata as Record<string, unknown>;
  return {
    holdBookingUid: typeof record.holdBookingUid === "string" ? record.holdBookingUid : undefined,
  };
}

type HoldBookingParams = {
  taskId: string;
  teamId: number;
  userId: number;
  eventTypeId: number | null;
  title: string;
  startTime: Date;
  endTime: Date;
};

export async function createSmartFillHoldBooking(
  tx: Pick<PrismaClient, "booking" | "smartFillTask">,
  params: HoldBookingParams
): Promise<string> {
  const holdBookingUid = randomUUID();

  await tx.booking.create({
    data: {
      uid: holdBookingUid,
      title: `[Smart-Fill Hold] ${params.title}`,
      startTime: params.startTime,
      endTime: params.endTime,
      userId: params.userId,
      eventTypeId: params.eventTypeId,
      status: BookingStatus.PENDING,
      metadata: {
        source: SMART_FILL_HOLD_SOURCE,
        smartFillTaskId: params.taskId,
        teamId: params.teamId,
      },
    },
  });

  await tx.smartFillTask.update({
    where: { id: params.taskId },
    data: {
      metadata: {
        holdBookingUid,
      },
    },
  });

  return holdBookingUid;
}

export async function releaseSmartFillHoldBooking(
  prisma: Pick<PrismaClient, "booking" | "smartFillTask">,
  taskId: string,
  metadata: unknown
): Promise<void> {
  const { holdBookingUid } = parseSmartFillTaskMetadata(metadata);

  if (holdBookingUid) {
    await prisma.booking.updateMany({
      where: { uid: holdBookingUid, status: BookingStatus.PENDING },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  await prisma.smartFillTask.update({
    where: { id: taskId },
    data: { metadata: {} },
  });
}
