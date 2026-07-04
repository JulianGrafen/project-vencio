import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOperation, PvsSyncOutboxStatus } from "@calcom/prisma/enums";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { isPvsSyncEnabled } from "./feature-flags";
import { enqueuePvsAppointmentSync, enqueuePvsOperationIfNotDuplicate } from "./enqueue-pvs-sync";

type PrismaTx = Pick<PrismaClient, "pvsSyncOutbox">;

async function resolvePvsExternalIdForBooking(
  tx: PrismaTx,
  teamId: number,
  bookingUid: string
): Promise<string | undefined> {
  const completed = await tx.pvsSyncOutbox.findFirst({
    where: {
      teamId,
      bookingUid,
      operation: PvsSyncOperation.CREATE_APPOINTMENT,
      status: PvsSyncOutboxStatus.COMPLETED,
      externalId: { not: null },
    },
    select: { externalId: true },
    orderBy: { updatedAt: "desc" },
  });

  return completed?.externalId ?? undefined;
}

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
  smartFillTaskId?: string;
  cancellationReason?: string | null;
  rescheduledToBookingUid?: string;
};

export function toAppointmentSyncDto(input: BookingPvsSyncInput): AppointmentSyncDTO {
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
    smartFillTaskId: input.smartFillTaskId,
    cancellationReason: input.cancellationReason ?? undefined,
    rescheduledToBookingUid: input.rescheduledToBookingUid,
  };
}

async function enqueuePvsBookingOperationIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput,
  operation: PvsSyncOperation
): Promise<{ outboxId: string } | null> {
  if (!isPvsSyncEnabled()) {
    return null;
  }

  let dto = toAppointmentSyncDto(input);

  if (
    operation === PvsSyncOperation.CANCEL_APPOINTMENT ||
    operation === PvsSyncOperation.UPDATE_APPOINTMENT
  ) {
    const pvsExternalId = await resolvePvsExternalIdForBooking(tx, input.teamId, input.bookingUid);
    if (pvsExternalId) {
      dto = { ...dto, pvsExternalId };
    }
  }

  if (operation === PvsSyncOperation.CREATE_APPOINTMENT) {
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

    return enqueuePvsAppointmentSync(tx, dto, operation);
  }

  return enqueuePvsOperationIfNotDuplicate(tx, dto, operation);
}

export async function enqueueBookingPvsSyncIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  return enqueuePvsBookingOperationIfEnabled(tx, input, PvsSyncOperation.CREATE_APPOINTMENT);
}

export async function enqueueBookingPvsCancelIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  return enqueuePvsBookingOperationIfEnabled(tx, input, PvsSyncOperation.CANCEL_APPOINTMENT);
}

export async function enqueueBookingPvsUpdateIfEnabled(
  tx: PrismaTx,
  input: BookingPvsSyncInput
): Promise<{ outboxId: string } | null> {
  return enqueuePvsBookingOperationIfEnabled(tx, input, PvsSyncOperation.UPDATE_APPOINTMENT);
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

export function resolveBookerAttendee(
  attendees: BookingRecordForPvsSync["attendees"],
  bookerEmail?: string
) {
  if (bookerEmail) {
    return attendees.find((attendee) => attendee.email === bookerEmail) ?? attendees[0];
  }
  return attendees[0];
}

export function bookingToPvsSyncInput(
  teamId: number,
  booking: BookingRecordForPvsSync,
  extras?: {
    bookerEmail?: string;
    fallbackPhone?: string | null;
    cancellationReason?: string | null;
    rescheduledToBookingUid?: string;
    source?: AppointmentSyncDTO["source"];
    smartFillTaskId?: string;
  }
): BookingPvsSyncInput | null {
  const attendee = resolveBookerAttendee(booking.attendees, extras?.bookerEmail);
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
    patientPhone: attendee.phoneNumber ?? extras?.fallbackPhone ?? undefined,
    source: extras?.source ?? "booker",
    smartFillTaskId: extras?.smartFillTaskId,
    cancellationReason: extras?.cancellationReason,
    rescheduledToBookingUid: extras?.rescheduledToBookingUid,
  };
}

export async function runPvsBookingSyncInTransaction(
  prisma: Pick<PrismaClient, "$transaction">,
  input: BookingPvsSyncInput,
  enqueueFn: (tx: PrismaTx, input: BookingPvsSyncInput) => Promise<{ outboxId: string } | null>
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await enqueueFn(tx, input);
  });
}

export async function enqueuePvsSyncForCancelledBooking(
  prisma: Pick<PrismaClient, "$transaction">,
  teamId: number,
  booking: BookingRecordForPvsSync,
  cancellationReason?: string | null
): Promise<void> {
  const input = bookingToPvsSyncInput(teamId, booking, { cancellationReason });
  if (!input) {
    return;
  }

  await runPvsBookingSyncInTransaction(prisma, input, enqueueBookingPvsCancelIfEnabled);
}
