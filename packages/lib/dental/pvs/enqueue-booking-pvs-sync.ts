import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOperation } from "@calcom/prisma/enums";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { isPvsSyncEnabled } from "./feature-flags";
import { enqueuePvsAppointmentSync, enqueuePvsOperationIfNotDuplicate } from "./enqueue-pvs-sync";

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
  cancellationReason?: string | null;
  rescheduledToBookingUid?: string;
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
    cancellationReason: input.cancellationReason ?? undefined,
    rescheduledToBookingUid: input.rescheduledToBookingUid,
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
    where: {
      teamId: input.teamId,
      bookingUid: input.bookingUid,
      operation: PvsSyncOperation.CREATE_APPOINTMENT,
    },
    select: { id: true },
  });

  if (existing) {
    return null;
  }

  return enqueuePvsAppointmentSync(tx, toAppointmentSyncDto(input), PvsSyncOperation.CREATE_APPOINTMENT);
}

export async function enqueueBookingPvsCancelIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  if (!isPvsSyncEnabled()) {
    return null;
  }

  return enqueuePvsOperationIfNotDuplicate(
    tx,
    toAppointmentSyncDto(input),
    PvsSyncOperation.CANCEL_APPOINTMENT
  );
}

export async function enqueueBookingPvsUpdateIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  if (!isPvsSyncEnabled()) {
    return null;
  }

  return enqueuePvsOperationIfNotDuplicate(
    tx,
    toAppointmentSyncDto(input),
    PvsSyncOperation.UPDATE_APPOINTMENT
  );
}

export type BookingRecordForPvsSync = {
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  eventTypeId: number | null;
  attendees: Array<{
    name: string;
    email: string;
    phoneNumber: string | null;
  }>;
};

export function bookingToPvsSyncInput(
  teamId: number,
  booking: BookingRecordForPvsSync,
  extras?: {
    cancellationReason?: string | null;
    rescheduledToBookingUid?: string;
    source?: AppointmentSyncDTO["source"];
  }
): BookingPvsSyncInput | null {
  const attendee = booking.attendees[0];
  if (!attendee) {
    return null;
  }

  return {
    bookingUid: booking.uid,
    teamId,
    title: booking.title,
    startTime: booking.startTime,
    endTime: booking.endTime,
    eventTypeId: booking.eventTypeId,
    patientName: attendee.name,
    patientEmail: attendee.email,
    patientPhone: attendee.phoneNumber,
    source: extras?.source ?? "booker",
    cancellationReason: extras?.cancellationReason,
    rescheduledToBookingUid: extras?.rescheduledToBookingUid,
  };
}

export async function enqueuePvsSyncForCancelledBooking(
  prisma: PrismaClient,
  teamId: number,
  booking: BookingRecordForPvsSync,
  cancellationReason?: string | null
): Promise<void> {
  const input = bookingToPvsSyncInput(teamId, booking, { cancellationReason });
  if (!input) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await enqueueBookingPvsCancelIfEnabled(tx, input);
  });
}
