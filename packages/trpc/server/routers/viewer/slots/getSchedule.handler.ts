import { getAvailableSlotsService } from "@calcom/features/di/containers/AvailableSlots";
import {
  applyTreatmentResourceConstraints,
  loadTreatmentResourceSchedule,
} from "@calcom/lib/dental/resource-schedule";
import {
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

  const parsedDuration =
    typeof input.duration === "number"
      ? input.duration
      : input.duration
        ? Number.parseInt(input.duration, 10)
        : undefined;

  const eventDurationMinutes =
    parsedDuration && !Number.isNaN(parsedDuration)
      ? parsedDuration
      : await resolveEventTypeDurationMinutes(input.eventTypeId);

  const [busyIntervals, resourceSchedule] = await Promise.all([
    getTreatmentResourceBusyIntervals(
      input.treatmentResourceId,
      new Date(input.startTime),
      new Date(input.endTime)
    ),
    loadTreatmentResourceSchedule(input.treatmentResourceId),
  ]);

  return applyTreatmentResourceConstraints(schedule, {
    resourceSchedule,
    busyIntervals,
    eventDurationMinutes,
  });
};
