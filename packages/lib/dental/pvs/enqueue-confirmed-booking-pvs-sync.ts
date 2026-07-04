import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { resolveTeamIdFromEventTypeId } from "../practice-team-resolver";
import {
  bookingToPvsSyncInput,
  enqueueBookingPvsSyncIfEnabled,
  type BookingRecordForPvsSync,
} from "./enqueue-booking-pvs-sync";

type ConfirmedBookingRecord = BookingRecordForPvsSync & {
  status: BookingStatus;
  eventTypeId: number | null;
};

export async function enqueuePvsSyncForConfirmedBooking(
  prisma: PrismaClient,
  booking: ConfirmedBookingRecord
): Promise<void> {
  if (booking.status !== BookingStatus.ACCEPTED || !booking.eventTypeId) {
    return;
  }

  const teamId = await resolveTeamIdFromEventTypeId(prisma, booking.eventTypeId);
  if (!teamId) {
    return;
  }

  const input = bookingToPvsSyncInput(teamId, booking, { source: "booker" });
  if (!input) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await enqueueBookingPvsSyncIfEnabled(tx, input);
  });
}
