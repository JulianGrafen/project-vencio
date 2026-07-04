import { z } from "zod";

const insuranceTypeValues = ["GESETZLICH", "PRIVAT", "SELBSTZAHLER"] as const;

const medicalCategoryValues = [
  "PROPHYLAXE",
  "SCHMERZBEHANDLUNG",
  "KONTROLLE",
  "FUELLUNG",
  "IMPLANTOLOGIE",
  "KIEFERORTHOPAEDIE",
  "SONSTIGES",
] as const;

export const ZInsuranceType = z.enum(insuranceTypeValues);
export const ZMedicalCategory = z.enum(medicalCategoryValues);

export const ZMedicalProfileUpsertInput = z.object({
  teamId: z.number().int().positive(),
  eventTypeId: z.number().int().positive(),
  category: ZMedicalCategory,
  allowedInsuranceTypes: z.array(ZInsuranceType).max(insuranceTypeValues.length),
  displayOrder: z.number().int().min(0).optional(),
  isEmergency: z.boolean().optional(),
});

export const ZMedicalProfileGetInput = z.object({
  teamId: z.number().int().positive(),
  eventTypeId: z.number().int().positive(),
});

export type MedicalProfileUpsertInput = z.infer<typeof ZMedicalProfileUpsertInput>;
