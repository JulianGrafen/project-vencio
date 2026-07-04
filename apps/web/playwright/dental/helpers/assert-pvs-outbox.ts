import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";
import { PvsSyncOperation } from "@calcom/prisma/enums";

export async function expectPvsCreateOutbox(params: {
  teamId: number;
  bookingUid: string;
  payload: Record<string, unknown>;
}) {
  const outbox = await prisma.pvsSyncOutbox.findFirst({
    where: {
      teamId: params.teamId,
      bookingUid: params.bookingUid,
      operation: PvsSyncOperation.CREATE_APPOINTMENT,
    },
  });

  expect(outbox).not.toBeNull();
  expect(outbox?.payload).toMatchObject(params.payload);
  return outbox;
}
