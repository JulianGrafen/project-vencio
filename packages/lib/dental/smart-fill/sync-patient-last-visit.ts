import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { createEmailBlindIndex } from "../../encryption/blind-index";
import { getPracticeKeyResolver } from "../../encryption/key-resolver";
import type { PracticeKeyStore } from "../../encryption/prisma-types";
import { isDentalEncryptionEnabled } from "../feature-flags";
import { isSmartFillEnabled } from "./feature-flags";

type PrismaTx = Pick<PrismaClient, "smartFillPatient">;

const ACCEPTED_VISIT_STATUSES: BookingStatus[] = [
  BookingStatus.ACCEPTED,
  BookingStatus.PENDING,
  BookingStatus.AWAITING_HOST,
];

export function shouldSyncPatientLastVisit(status: BookingStatus): boolean {
  return ACCEPTED_VISIT_STATUSES.includes(status);
}

/**
 * Updates SmartFillPatient.lastVisitAt when a pool patient completes a regular booking.
 * Enables Recall-Maschine without requiring a Smart-Fill confirm flow first.
 */
export async function syncSmartFillPatientLastVisitFromBooking(
  prisma: PracticeKeyStore & PrismaTx,
  params: {
    teamId: number;
    bookerEmail: string;
    startTime: Date;
  }
): Promise<boolean> {
  if (!isSmartFillEnabled()) {
    return false;
  }

  const email = params.bookerEmail.trim().toLowerCase();
  if (!email) {
    return false;
  }

  let patientId: string | null = null;

  if (isDentalEncryptionEnabled()) {
    const resolver = getPracticeKeyResolver(prisma);
    const { dek } = await resolver.resolve(params.teamId);
    const emailBlindIndex = createEmailBlindIndex(email, dek);
    const patient = await prisma.smartFillPatient.findFirst({
      where: { teamId: params.teamId, emailBlindIndex },
      select: { id: true },
    });
    patientId = patient?.id ?? null;
  } else {
    const patients = await prisma.smartFillPatient.findMany({
      where: { teamId: params.teamId },
      select: { id: true, email: true },
    });
    const match = patients.find((p) => p.email.trim().toLowerCase() === email);
    patientId = match?.id ?? null;
  }

  if (!patientId) {
    return false;
  }

  await prisma.smartFillPatient.update({
    where: { id: patientId },
    data: { lastVisitAt: params.startTime },
  });

  return true;
}
