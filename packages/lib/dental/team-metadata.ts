import { z } from "zod";

import { DENTAL_EVENT_CATEGORIES } from "./event-type-categories";

export const dentalTeamMetadataSchema = z.object({
  practiceName: z.string().optional(),
  practiceAddress: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bookingPublicKeyPem: z.string().optional(),
  bookingPublicKeyVersion: z.number().int().positive().optional(),
});

export type DentalTeamMetadata = z.infer<typeof dentalTeamMetadataSchema>;

export const dentalEventTypeMetadataSchema = z.object({
  dentalCategory: z.enum(DENTAL_EVENT_CATEGORIES).optional(),
});

export type DentalEventTypeMetadata = z.infer<typeof dentalEventTypeMetadataSchema>;

type TeamMetadataLike = {
  dental?: DentalTeamMetadata | null;
} | null;

export function parseDentalTeamMetadata(metadata: unknown): DentalTeamMetadata {
  const dental = (metadata as TeamMetadataLike)?.dental;
  const parsed = dentalTeamMetadataSchema.safeParse(dental ?? {});
  return parsed.success ? parsed.data : {};
}

export function mergeDentalTeamMetadata(
  existingMetadata: Record<string, unknown> | null | undefined,
  dental: DentalTeamMetadata
): Record<string, unknown> {
  const current = (existingMetadata ?? {}) as Record<string, unknown>;
  const currentDental = parseDentalTeamMetadata(current);

  return {
    ...current,
    dental: {
      ...currentDental,
      ...dental,
    },
  };
}

export type DentalPracticeInfo = {
  practiceName: string;
  practiceAddress?: string;
  emergencyPhone?: string;
};

export function resolveDentalPracticeInfo(params: {
  teamName?: string | null;
  teamMetadata?: unknown;
  userMetadata?: unknown;
  profileName?: string | null;
}): DentalPracticeInfo {
  const dental = {
    ...parseDentalTeamMetadata(params.teamMetadata),
    ...parseDentalUserMetadata(params.userMetadata),
  };

  return {
    practiceName: dental.practiceName?.trim() || params.teamName?.trim() || params.profileName?.trim() || "Zahnarztpraxis",
    practiceAddress: dental.practiceAddress?.trim() || undefined,
    emergencyPhone: dental.emergencyPhone?.trim() || undefined,
  };
}

export function parseDentalUserMetadata(metadata: unknown): DentalTeamMetadata {
  const dental = (metadata as TeamMetadataLike)?.dental;
  const parsed = dentalTeamMetadataSchema.safeParse(dental ?? {});
  return parsed.success ? parsed.data : {};
}

export function mergeDentalUserMetadata(
  existingMetadata: Record<string, unknown> | null | undefined,
  dental: DentalTeamMetadata
): Record<string, unknown> {
  const current = (existingMetadata ?? {}) as Record<string, unknown>;
  const currentDental = parseDentalUserMetadata(current);

  return {
    ...current,
    dental: {
      ...currentDental,
      ...dental,
    },
  };
}

export function resolveDentalPracticeAddressFromContext(params: {
  teamMetadata?: unknown;
  userMetadata?: unknown;
}): string | undefined {
  const dental = {
    ...parseDentalTeamMetadata(params.teamMetadata),
    ...parseDentalUserMetadata(params.userMetadata),
  };

  return dental.practiceAddress?.trim() || undefined;
}
