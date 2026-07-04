import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";

import {
  SMART_FILL_BUSY_BOOKING_STATUSES,
  SMART_FILL_DEFAULT_WORK_DAYS,
  SMART_FILL_DEFAULT_WORK_END_MINUTES,
  SMART_FILL_DEFAULT_WORK_START_MINUTES,
  SMART_FILL_LOOKAHEAD_HOURS,
  SMART_FILL_MIN_GAP_MINUTES,
} from "./constants";
import type { SmartFillCronHost } from "./smart-fill-cron-host-loader";
import {
  findSmartFillCandidateSlots,
  type WeeklyAvailabilityWindow,
} from "./smart-fill-slot-scanner";
import { timeToMinutesUtc } from "./time-utils";

function defaultAvailability(): WeeklyAvailabilityWindow[] {
  return SMART_FILL_DEFAULT_WORK_DAYS.map((day) => ({
    dayOfWeek: day,
    startMinutes: SMART_FILL_DEFAULT_WORK_START_MINUTES,
    endMinutes: SMART_FILL_DEFAULT_WORK_END_MINUTES,
  }));
}

export async function scanSmartFillSlotsForHost(
  prisma: PrismaClient,
  host: SmartFillCronHost
): Promise<Array<{ start: Date; end: Date }>> {
  const now = dayjs();
  const windowStart = now.toDate();
  const windowEnd = now.add(SMART_FILL_LOOKAHEAD_HOURS, "hour").toDate();

  const schedule = await prisma.schedule.findFirst({
    where: { userId: host.userId },
    include: { availability: true },
  });

  const availability: WeeklyAvailabilityWindow[] =
    schedule?.availability.flatMap((slot) =>
      slot.days.map((dayOfWeek) => ({
        dayOfWeek,
        startMinutes: timeToMinutesUtc(slot.startTime),
        endMinutes: timeToMinutesUtc(slot.endTime),
      }))
    ) ?? defaultAvailability();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: host.userId,
      status: { in: [...SMART_FILL_BUSY_BOOKING_STATUSES] },
      startTime: { lt: windowEnd },
      endTime: { gt: windowStart },
    },
    select: { startTime: true, endTime: true },
  });

  return findSmartFillCandidateSlots({
    windowStart,
    windowEnd,
    minDurationMinutes: SMART_FILL_MIN_GAP_MINUTES,
    availability,
    busyIntervals: bookings.map((booking) => ({ start: booking.startTime, end: booking.endTime })),
    timeZone: host.timeZone,
  });
}
