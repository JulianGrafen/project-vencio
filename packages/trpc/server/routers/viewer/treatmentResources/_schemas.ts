import { TreatmentResourceTypeSchema } from "@calcom/prisma/zod/inputTypeSchemas/TreatmentResourceTypeSchema";
import { z } from "zod";

export const ZTreatmentResourceListInput = z.object({
  teamId: z.number(),
});

export const ZTreatmentResourceListForEventTypeInput = z.object({
  eventTypeId: z.number(),
});

export const ZTreatmentResourceCreateInput = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  slug: z.string().min(1),
  type: TreatmentResourceTypeSchema.default("CHAIR"),
  scheduleId: z.number().optional(),
});

export const ZTreatmentResourceUpdateInput = z.object({
  resourceId: z.string(),
  teamId: z.number(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: TreatmentResourceTypeSchema.optional(),
  scheduleId: z.number().nullable().optional(),
});

export const ZTreatmentResourceDeactivateInput = z.object({
  resourceId: z.string(),
  teamId: z.number(),
});
