import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOperation } from "@calcom/prisma/enums";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

type PrismaTx = Pick<PrismaClient, "pvsSyncOutbox">;

export async function enqueuePvsAppointmentSync(
  tx: PrismaTx,
  dto: AppointmentSyncDTO
): Promise<{ outboxId: string }> {
  const row = await tx.pvsSyncOutbox.create({
    data: {
      teamId: dto.teamId,
      bookingUid: dto.bookingUid,
      operation: PvsSyncOperation.CREATE_APPOINTMENT,
      payload: dto,
    },
    select: { id: true },
  });

  return { outboxId: row.id };
}
