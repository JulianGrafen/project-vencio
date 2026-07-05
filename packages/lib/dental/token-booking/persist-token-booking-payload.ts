import type { PrismaClient } from "@calcom/prisma";

import type { TokenBookingPayloadRow } from "./seal-booking-sensitive-data";

type PrismaTx = Pick<PrismaClient, "tokenBookingPayload">;

/** Dual-write: persist sealed payload in first-class table (metadata mirror kept for transition). */
export async function persistTokenBookingPayload(
  tx: PrismaTx,
  bookingUid: string,
  row: TokenBookingPayloadRow
): Promise<void> {
  await tx.tokenBookingPayload.create({
    data: {
      bookingUid,
      teamId: row.teamId,
      keyVersion: row.keyVersion,
      algorithm: row.algorithm,
      encryptedBlob: row.encryptedBlob,
      referenceHash: row.referenceHash,
    },
  });
}
