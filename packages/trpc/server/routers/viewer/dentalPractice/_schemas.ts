import { z } from "zod";

export const ZDentalPracticeGetInput = z.object({
  teamId: z.number().int().positive(),
});

export const ZDentalPracticeUpdateInput = z.object({
  teamId: z.number().int().positive(),
  practiceName: z.string().optional(),
  practiceAddress: z.string().optional(),
  emergencyPhone: z.string().optional(),
});
