import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { resolveTeamIdFromEventTypeId } from "../practice-team-resolver";
import { enqueueBookingPvsSyncIfEnabled } from "./enqueue-booking-pvs-sync";

type ConfirmedBookingRecord = {
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  eventTypeId: number | null;
  attendees: Array<{
    name: string;
    email: string;
    phoneNumber: string | null;
  }>;
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

  const primaryAttendee = booking.attendees[0];
  if (!primaryAttendee) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await enqueueBookingPvsSyncIfEnabled(tx, {
      bookingUid: booking.uid,
      teamId,
      title: booking.title,
      startTime: booking.startTime,
      endTime: booking.endTime,
      eventTypeId: booking.eventTypeId,
      patientName: primaryAttendee.name,
      patientEmail: primaryAttendee.email,
      patientPhone: primaryAttendee.phoneNumber,
      source: "booker",
    });
  });
}
