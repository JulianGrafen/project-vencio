import type { PrismaClient } from "@calcom/prisma";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { isPvsSyncEnabled } from "./feature-flags";
import { enqueuePvsAppointmentSync } from "./enqueue-pvs-sync";

type PrismaTx = Pick<PrismaClient, "pvsSyncOutbox">;

export type BookingPvsSyncInput = {
  bookingUid: string;
  teamId: number;
  title: string;
  startTime: Date;
  endTime: Date;
  eventTypeId?: number | null;
  patientName: string;
  patientEmail: string;
  patientPhone?: string | null;
  source?: AppointmentSyncDTO["source"];
};

function toAppointmentSyncDto(input: BookingPvsSyncInput): AppointmentSyncDTO {
  return {
    bookingUid: input.bookingUid,
    teamId: input.teamId,
    patientName: input.patientName,
    patientEmail: input.patientEmail,
    patientPhone: input.patientPhone ?? undefined,
    startTime: input.startTime.toISOString(),
    endTime: input.endTime.toISOString(),
    title: input.title,
    eventTypeId: input.eventTypeId ?? null,
    source: input.source ?? "booker",
  };
}

export async function enqueueBookingPvsSyncIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  if (!isPvsSyncEnabled()) {
    return null;
  }

  const existing = await tx.pvsSyncOutbox.findFirst({
    where: { teamId: input.teamId, bookingUid: input.bookingUid },
    select: { id: true },
  });

  if (existing) {
    return null;
  }

  return enqueuePvsAppointmentSync(tx, toAppointmentSyncDto(input));
}
