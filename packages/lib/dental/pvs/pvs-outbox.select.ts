import type { Prisma } from "@calcom/prisma/generated/prisma/client";

export const PVS_OUTBOX_JOB_POLL_SELECT = {
  id: true,
  teamId: true,
  bookingUid: true,
  operation: true,
  payload: true,
  attempts: true,
  createdAt: true,
} as const satisfies Prisma.PvsSyncOutboxSelect;

export type PvsOutboxJobPollRow = Prisma.PvsSyncOutboxGetPayload<{
  select: typeof PVS_OUTBOX_JOB_POLL_SELECT;
}>;
