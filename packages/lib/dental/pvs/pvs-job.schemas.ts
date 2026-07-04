import { z } from "zod";

/** Minimal validation for outbox job payloads before PVS adapter dispatch. */
export const ZPvsOutboxJobPayload = z.object({
  bookingUid: z.string().min(1),
  teamId: z.number().int().positive(),
  patientName: z.string().min(1),
  patientEmail: z.string().email(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  title: z.string().min(1),
  source: z.enum(["booker", "smart-fill", "api"]),
  patientPhone: z.string().optional(),
  eventTypeId: z.number().nullable().optional(),
  smartFillTaskId: z.string().optional(),
  cancellationReason: z.string().optional(),
  rescheduledToBookingUid: z.string().optional(),
});

export const ZPvsOutboxJobDto = z.object({
  id: z.string().min(1),
  teamId: z.number().int().positive(),
  bookingUid: z.string().min(1),
  operation: z.enum(["CREATE_APPOINTMENT", "UPDATE_APPOINTMENT", "CANCEL_APPOINTMENT"]),
  payload: ZPvsOutboxJobPayload,
  attempts: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
});

export type ValidatedPvsOutboxJob = z.infer<typeof ZPvsOutboxJobDto>;
