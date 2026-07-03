import dayjs from "@calcom/dayjs";

export type TimeInterval = {
  start: Date;
  end: Date;
};

export type WeeklyAvailabilityWindow = {
  /** 0 = Sunday … 6 = Saturday (matches Prisma Availability.days) */
  dayOfWeek: number;
  /** Minutes from midnight in local schedule timezone */
  startMinutes: number;
  endMinutes: number;
};

export type SlotScanParams = {
  windowStart: Date;
  windowEnd: Date;
  minDurationMinutes: number;
  availability: WeeklyAvailabilityWindow[];
  busyIntervals: TimeInterval[];
  timeZone: string;
};

/**
 * Finds free calendar gaps by subtracting busy bookings from weekly availability windows.
 * Pure function — easy to unit test without DB.
 */
export function findSmartFillCandidateSlots(params: SlotScanParams): TimeInterval[] {
  const {
    windowStart,
    windowEnd,
    minDurationMinutes,
    availability,
    busyIntervals,
    timeZone,
  } = params;

  const candidates: TimeInterval[] = [];
  let cursor = dayjs(windowStart).tz(timeZone).startOf("day");
  const end = dayjs(windowEnd).tz(timeZone);

  while (cursor.isBefore(end)) {
    const dayOfWeek = cursor.day();
    const dayWindows = availability.filter((w) => w.dayOfWeek === dayOfWeek);

    for (const window of dayWindows) {
      const slotStart = cursor
        .hour(Math.floor(window.startMinutes / 60))
        .minute(window.startMinutes % 60)
        .second(0);
      const slotEnd = cursor
        .hour(Math.floor(window.endMinutes / 60))
        .minute(window.endMinutes % 60)
        .second(0);

      let freeStart = slotStart;
      const dayBusy = busyIntervals
        .filter((b) => dayjs(b.start).tz(timeZone).isSame(cursor, "day"))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      const pushGap = (gapStart: dayjs.Dayjs, gapEnd: dayjs.Dayjs) => {
        if (gapEnd.diff(gapStart, "minute") < minDurationMinutes) return;
        const start = gapStart.toDate();
        const endDate = gapEnd.toDate();
        if (start < windowEnd && endDate > windowStart) {
          candidates.push({
            start: start < windowStart ? windowStart : start,
            end: endDate > windowEnd ? windowEnd : endDate,
          });
        }
      };

      for (const busy of dayBusy) {
        const busyStart = dayjs(busy.start).tz(timeZone);
        const busyEnd = dayjs(busy.end).tz(timeZone);
        if (busyEnd.isBefore(freeStart) || busyStart.isAfter(slotEnd)) continue;
        pushGap(freeStart, busyStart);
        freeStart = busyEnd.isAfter(freeStart) ? busyEnd : freeStart;
      }

      pushGap(freeStart, slotEnd);
    }

    cursor = cursor.add(1, "day");
  }

  return candidates.filter(
    (slot) => dayjs(slot.end).diff(dayjs(slot.start), "minute") >= minDurationMinutes
  );
}
