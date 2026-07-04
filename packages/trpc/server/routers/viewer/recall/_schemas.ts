import { z } from "zod";

export const ZRecallPendingInput = z.object({
  teamId: z.number().int().positive(),
});

export const ZRecallHistoryInput = z.object({
  teamId: z.number().int().positive(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const ZRecallSettingsUpdateInput = z.object({
  teamId: z.number().int().positive(),
  enabled: z.boolean().optional(),
  intervalMonths: z.number().int().min(1).max(24).optional(),
  toleranceDays: z.number().int().min(0).max(14).optional(),
  bookingSlug: z.string().trim().min(1).max(128).nullable().optional(),
  eventTypeId: z.number().int().positive().nullable().optional(),
  practiceName: z.string().trim().min(1).max(128).optional(),
  emailSubject: z.string().trim().min(1).max(200).optional(),
  emailHtmlTemplate: z.string().min(1).optional(),
  emailTextTemplate: z.string().nullable().optional(),
  smsEnabled: z.boolean().optional(),
  smsTemplate: z.string().nullable().optional(),
});
