import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { SMART_FILL_BOOKING_SOURCE, SMART_FILL_DEFAULT_BOOKING_TITLE } from "./constants";

type SmartFillAttendeeInput = {
  email: string;
  name: string;
  timeZone: string;
  locale: string | null;
};

type SmartFillBookingTaskInput = {
  id: string;
  teamId: number;
  userId: number;
  eventTypeId: number | null;
  startTime: Date;
  endTime: Date;
  eventTypeTitle?: string | null;
};

type FinalizeSmartFillBookingParams = {
  bookingUid: string;
  holdBookingUid?: string;
  task: SmartFillBookingTaskInput;
  patient: SmartFillAttendeeInput;
};

export async function finalizeSmartFillBooking(
  tx: Pick<PrismaClient, "booking">,
  params: FinalizeSmartFillBookingParams
): Promise<void> {
  const title = params.task.eventTypeTitle ?? SMART_FILL_DEFAULT_BOOKING_TITLE;
  const metadata = { source: SMART_FILL_BOOKING_SOURCE, smartFillTaskId: params.task.id };
  const attendee = {
    email: params.patient.email,
    name: params.patient.name,
    timeZone: params.patient.timeZone,
    locale: params.patient.locale ?? "de",
  };

  if (params.holdBookingUid) {
    await tx.booking.update({
      where: { uid: params.holdBookingUid },
      data: {
        status: BookingStatus.ACCEPTED,
        title,
        metadata,
        attendees: { create: attendee },
      },
    });
    return;
  }

  await tx.booking.create({
    data: {
      uid: params.bookingUid,
      title,
      startTime: params.task.startTime,
      endTime: params.task.endTime,
      userId: params.task.userId,
      eventTypeId: params.task.eventTypeId,
      status: BookingStatus.ACCEPTED,
      metadata,
      attendees: { create: attendee },
    },
  });
}
