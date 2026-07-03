import dayjs from "@calcom/dayjs";
import { prisma } from "@calcom/prisma";
import type { IGetAvailableSlots } from "@calcom/features/bookings/Booker/hooks/useAvailableTimeSlots";
import { BookingStatus } from "@calcom/prisma/enums";

type BusyInterval = { start: Date; end: Date };

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.ACCEPTED,
  BookingStatus.PENDING,
  BookingStatus.AWAITING_HOST,
];

export async function getTreatmentResourceBusyIntervals(
  resourceId: string,
  rangeStart: Date,
  rangeEnd: Date
): Promise<BusyInterval[]> {
  const rows = await prisma.bookingResource.findMany({
    where: {
      resourceId,
      booking: {
        status: { in: ACTIVE_BOOKING_STATUSES },
        startTime: { lt: rangeEnd },
        endTime: { gt: rangeStart },
      },
    },
    select: {
      booking: {
        select: {
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  return rows.map(({ booking }) => ({
    start: booking.startTime,
    end: booking.endTime,
  }));
}

function slotOverlapsBusyInterval(
  slotStart: dayjs.Dayjs,
  eventDurationMinutes: number,
  busyIntervals: BusyInterval[]
): boolean {
  const slotEnd = slotStart.add(eventDurationMinutes, "minute");

  return busyIntervals.some((busy) => {
    const busyStart = dayjs(busy.start);
    const busyEnd = dayjs(busy.end);
    return slotStart.isBefore(busyEnd) && slotEnd.isAfter(busyStart);
  });
}

/**
 * Removes slots that overlap with an already-booked treatment resource (chair/room).
 */
export function filterAvailableSlotsByResourceBusyTimes(
  schedule: IGetAvailableSlots,
  busyIntervals: BusyInterval[],
  eventDurationMinutes: number
): IGetAvailableSlots {
  if (busyIntervals.length === 0) {
    return schedule;
  }

  const filteredSlots: IGetAvailableSlots["slots"] = {};

  for (const [dateKey, daySlots] of Object.entries(schedule.slots)) {
    const available = daySlots.filter(
      (slot) => !slotOverlapsBusyInterval(dayjs(slot.time), eventDurationMinutes, busyIntervals)
    );

    if (available.length > 0) {
      filteredSlots[dateKey] = available;
    }
  }

  return { ...schedule, slots: filteredSlots };
}

export async function resolveEventTypeDurationMinutes(eventTypeId: number): Promise<number> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { length: true },
  });

  return eventType?.length ?? 30;
}
