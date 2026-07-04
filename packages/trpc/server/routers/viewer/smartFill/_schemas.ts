import { z } from "zod";

export const ZSmartFillDashboardInput = z.object({
  teamId: z.number(),
});

export const ZSmartFillPatientListInput = z.object({
  teamId: z.number(),
});

export const ZSmartFillPatientCreateInput = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  waitlistEnabled: z.boolean().default(false),
  recallEnabled: z.boolean().default(true),
  priorityScore: z.number().int().min(0).max(1000).default(0),
  preferredEventTypeId: z.number().nullable().optional(),
});

export const ZSmartFillPatientUpdateInput = z.object({
  teamId: z.number(),
  patientId: z.string(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(5).optional(),
  waitlistEnabled: z.boolean().optional(),
  recallEnabled: z.boolean().optional(),
  priorityScore: z.number().int().min(0).max(1000).optional(),
  preferredEventTypeId: z.number().nullable().optional(),
});

export const ZSmartFillPatientDeleteInput = z.object({
  teamId: z.number(),
  patientId: z.string(),
});
