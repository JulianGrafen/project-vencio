import { z } from "zod";

export const ZRecallCandidate = z.object({
  patientId: z.string().min(1),
  teamId: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  lastVisitAt: z.date(),
  recallDueDate: z.date(),
});

export type RecallCandidateInput = z.infer<typeof ZRecallCandidate>;

export const ZRecallCandidateQuery = z.object({
  teamId: z.number().int().positive(),
  intervalMonths: z.number().int().min(1).max(24),
  toleranceDays: z.number().int().min(0).max(14),
  referenceDate: z.date().optional(),
});

export const ZRecallOptOutToken = z.string().uuid();
