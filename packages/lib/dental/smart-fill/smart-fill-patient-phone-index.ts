import { createPhoneBlindIndex, normalizePhoneForIndex } from "../../encryption/blind-index";
import { getPracticeKeyResolver, type PracticeKeyResolver } from "../../encryption/key-resolver";
import type { PracticeKeyStore } from "../../encryption/prisma-types";
import { isDentalEncryptionEnabled } from "../feature-flags";
import { normalizePhoneNumber } from "./phone-utils";

/**
 * Resolves the stored phone lookup key for SmartFillPatient.
 * Uses DEK-backed blind index when encryption is enabled; digits-only hash otherwise.
 */
export async function resolveSmartFillPatientPhoneBlindIndex(
  prisma: PracticeKeyStore,
  teamId: number,
  phone: string,
  keyResolver?: PracticeKeyResolver
): Promise<string> {
  const normalized = normalizePhoneNumber(phone);

  if (isDentalEncryptionEnabled()) {
    const resolver = keyResolver ?? getPracticeKeyResolver(prisma);
    const { dek } = await resolver.resolve(teamId);
    return createPhoneBlindIndex(normalized, dek);
  }

  return normalizePhoneForIndex(normalized);
}

/** Plain lookup key for tests and non-encrypted deployments. */
export function resolveSmartFillPatientPhoneLookupKey(phone: string): string {
  return normalizePhoneForIndex(normalizePhoneNumber(phone));
}

export type SmartFillPatientPhoneLookupCondition = {
  teamId: number;
  phoneBlindIndex: string;
};

/**
 * Builds OR conditions for matching an inbound SMS sender to encrypted patient rows.
 * Limits blind-index computation to teams with active Smart-Fill invites.
 */
export async function buildSmartFillPatientPhoneLookupConditions(
  prisma: PracticeKeyStore & {
    smartFillInvite: {
      findMany(args: {
        where: Record<string, unknown>;
        select: { task: { select: { teamId: true } } };
      }): Promise<Array<{ task: { teamId: number } }>>;
    };
  },
  fromPhone: string,
  activeInviteWhere: Record<string, unknown>
): Promise<SmartFillPatientPhoneLookupCondition[]> {
  const activeInvites = await prisma.smartFillInvite.findMany({
    where: activeInviteWhere,
    select: { task: { select: { teamId: true } } },
  });

  const teamIds = [...new Set(activeInvites.map((invite) => invite.task.teamId))];
  if (teamIds.length === 0) {
    return [];
  }

  const keyResolver = isDentalEncryptionEnabled() ? getPracticeKeyResolver(prisma) : undefined;

  return Promise.all(
    teamIds.map(async (teamId) => ({
      teamId,
      phoneBlindIndex: await resolveSmartFillPatientPhoneBlindIndex(
        prisma,
        teamId,
        fromPhone,
        keyResolver
      ),
    }))
  );
}
