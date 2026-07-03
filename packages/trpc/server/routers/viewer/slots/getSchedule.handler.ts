import { getAvailableSlotsService } from "@calcom/features/di/containers/AvailableSlots";
import {
  filterAvailableSlotsByResourceBusyTimes,
  getTreatmentResourceBusyIntervals,
  resolveEventTypeDurationMinutes,
} from "@calcom/lib/dental/resource-availability";

import type { GetScheduleOptions } from "./types";

export const getScheduleHandler = async ({ ctx, input }: GetScheduleOptions) => {
  const availableSlotsService = getAvailableSlotsService();
  const schedule = await availableSlotsService.getAvailableSlots({ ctx, input });

  if (!input.treatmentResourceId || !input.eventTypeId) {
    return schedule;
  }

  const eventDurationMinutes = input.duration ?? (await resolveEventTypeDurationMinutes(input.eventTypeId));
  const busyIntervals = await getTreatmentResourceBusyIntervals(
    input.treatmentResourceId,
    new Date(input.startTime),
    new Date(input.endTime)
  );

  return filterAvailableSlotsByResourceBusyTimes(schedule, busyIntervals, eventDurationMinutes);
};
