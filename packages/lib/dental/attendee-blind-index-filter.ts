import { createEmailBlindIndex } from "../encryption/blind-index";
import { getPracticeKeyResolver, type PracticeKeyResolver } from "../encryption/key-resolver";
import type { PracticeKeyStore } from "../encryption/prisma-types";
import { isDentalComplianceMode } from "./compliance-config";

export function resolveTeamIdsForAttendeeEmailFilter(
  filterTeamIds: number[] | undefined,
  permissionTeamIds: number[]
): number[] {
  if (filterTeamIds?.length) {
    return filterTeamIds;
  }

  return permissionTeamIds.length ? permissionTeamIds : [];
}

export function shouldUseAttendeeEmailBlindIndexFilter(attendeeEmail: unknown): attendeeEmail is string {
  return isDentalComplianceMode() && typeof attendeeEmail === "string" && attendeeEmail.trim().length > 0;
}

export async function resolveAttendeeEmailBlindIndexes(
  keyResolver: PracticeKeyResolver,
  teamIds: number[],
  email: string
): Promise<string[]> {
  const indexes = await Promise.all(
    teamIds.map(async (teamId) => {
      const { dek } = await keyResolver.resolve(teamId);
      return createEmailBlindIndex(email, dek);
    })
  );

  return Array.from(new Set(indexes));
}

export async function prepareAttendeeEmailBlindIndexFilter({
  prisma,
  attendeeEmail,
  filterTeamIds,
  permissionTeamIds,
}: {
  prisma: PracticeKeyStore;
  attendeeEmail: unknown;
  filterTeamIds: number[] | undefined;
  permissionTeamIds: number[];
}): Promise<string[] | null> {
  if (!shouldUseAttendeeEmailBlindIndexFilter(attendeeEmail)) {
    return null;
  }

  const teamIds = resolveTeamIdsForAttendeeEmailFilter(filterTeamIds, permissionTeamIds);
  if (teamIds.length === 0) {
    return null;
  }

  const keyResolver = getPracticeKeyResolver(prisma);
  return resolveAttendeeEmailBlindIndexes(keyResolver, teamIds, attendeeEmail.trim());
}
