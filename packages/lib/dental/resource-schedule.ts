import dayjs from "@calcom/dayjs";
import { prisma } from "@calcom/prisma";
import type { IGetAvailableSlots } from "@calcom/features/bookings/Booker/hooks/useAvailableTimeSlots";

import type { BusyInterval } from "./resource-availability";
import { filterAvailableSlotsByResourceBusyTimes } from "./resource-availability";

export type ResourceScheduleAvailability = {
  days: number[];
  startTime: Date;
  endTime: Date;
  date: Date | null;
};

export type ResourceScheduleContext = {
  timeZone: string;
  availability: ResourceScheduleAvailability[];
};

function minutesFromTimeField(value: Date): number {
  return value.getUTCHours() * 60 + value.getUTCMinutes();
}

export function isSlotWithinResourceSchedule(
  slotIso: string,
  durationMinutes: number,
  schedule: ResourceScheduleContext | null
): boolean {
  if (!schedule || schedule.availability.length === 0) {
    return true;
  }

  const timeZone = schedule.timeZone || "UTC";
  const slotStart = dayjs(slotIso).tz(timeZone);
  const slotEnd = slotStart.add(durationMinutes, "minute");
  const slotDate = slotStart.format("YYYY-MM-DD");

  const dateOverride = schedule.availability.find(
    (entry) => entry.date && dayjs(entry.date).format("YYYY-MM-DD") === slotDate
  );

  const windows = dateOverride
    ? [dateOverride]
    : schedule.availability.filter((entry) => entry.days.includes(slotStart.day()));

  if (windows.length === 0) {
    return false;
  }

  const slotStartMinutes = slotStart.hour() * 60 + slotStart.minute();
  const slotEndMinutes = slotEnd.hour() * 60 + slotEnd.minute();

  return windows.some((window) => {
    const windowStart = minutesFromTimeField(window.startTime);
    const windowEnd = minutesFromTimeField(window.endTime);
    return slotStartMinutes >= windowStart && slotEndMinutes <= windowEnd;
  });
}

export function filterAvailableSlotsByResourceSchedule(
  schedule: IGetAvailableSlots,
  resourceSchedule: ResourceScheduleContext | null,
  eventDurationMinutes: number
): IGetAvailableSlots {
  if (!resourceSchedule?.availability.length) {
    return schedule;
  }

  const filteredSlots: IGetAvailableSlots["slots"] = {};

  for (const [dateKey, daySlots] of Object.entries(schedule.slots)) {
    const available = daySlots.filter((slot) =>
      isSlotWithinResourceSchedule(slot.time, eventDurationMinutes, resourceSchedule)
    );

    if (available.length > 0) {
      filteredSlots[dateKey] = available;
    }
  }

  return { ...schedule, slots: filteredSlots };
}

export async function loadTreatmentResourceSchedule(
  resourceId: string
): Promise<ResourceScheduleContext | null> {
  const resource = await prisma.treatmentResource.findUnique({
    where: { id: resourceId },
    select: {
      schedule: {
        select: {
          timeZone: true,
          availability: {
            select: {
              days: true,
              startTime: true,
              endTime: true,
              date: true,
            },
          },
        },
      },
    },
  });

  if (!resource?.schedule) {
    return null;
  }

  return {
    timeZone: resource.schedule.timeZone ?? "UTC",
    availability: resource.schedule.availability,
  };
}

/** Applies both schedule windows and existing booking busy intervals. */
export function applyTreatmentResourceConstraints(
  schedule: IGetAvailableSlots,
  params: {
    resourceSchedule: ResourceScheduleContext | null;
    busyIntervals: BusyInterval[];
    eventDurationMinutes: number;
  }
): IGetAvailableSlots {
  const withinSchedule = filterAvailableSlotsByResourceSchedule(
    schedule,
    params.resourceSchedule,
    params.eventDurationMinutes
  );

  return filterAvailableSlotsByResourceBusyTimes(
    withinSchedule,
    params.busyIntervals,
    params.eventDurationMinutes
  );
}
