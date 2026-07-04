import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOperation, PvsSyncOutboxStatus } from "@calcom/prisma/enums";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

type PrismaTx = Pick<PrismaClient, "pvsSyncOutbox">;

export async function enqueuePvsAppointmentSync(
  tx: PrismaTx,
  dto: AppointmentSyncDTO,
  operation: PvsSyncOperation = PvsSyncOperation.CREATE_APPOINTMENT
): Promise<{ outboxId: string }> {
  const row = await tx.pvsSyncOutbox.create({
    data: {
      teamId: dto.teamId,
      bookingUid: dto.bookingUid,
      operation,
      payload: dto,
    },
    select: { id: true },
  });

  return { outboxId: row.id };
}

export async function enqueuePvsOperationIfNotDuplicate(
  tx: PrismaTx,
  dto: AppointmentSyncDTO,
  operation: PvsSyncOperation
): Promise<{ outboxId: string } | null> {
  const existing = await tx.pvsSyncOutbox.findFirst({
    where: {
      teamId: dto.teamId,
      bookingUid: dto.bookingUid,
      operation,
      status: { in: [PvsSyncOutboxStatus.PENDING, PvsSyncOutboxStatus.PROCESSING] },
    },
    select: { id: true },
  });

  if (existing) {
    return null;
  }

  return enqueuePvsAppointmentSync(tx, dto, operation);
}
