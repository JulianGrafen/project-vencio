import prisma from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";

import { getPracticeKeyResolver } from "@calcom/lib/encryption/key-resolver";

import { computePublicKeyFingerprint } from "./public-key-fingerprint";
import { isDentalComplianceMode } from "../compliance-config";

export type PracticeBookingPublicKey = {
  teamId: number;
  publicKeyPem: string;
  keyVersion: number;
};

type DentalTeamMetadata = {
  dental?: {
    bookingPublicKeyPem?: string;
    bookingPublicKeyVersion?: number;
  };
};

function resolvePublicKeyFromMetadata(metadata: unknown): {
  publicKeyPem: string | null;
  keyVersion: number | null;
} {
  const dentalMeta = (metadata ?? {}) as DentalTeamMetadata;
  const publicKeyPem = dentalMeta.dental?.bookingPublicKeyPem?.trim() ?? null;
  const keyVersion = dentalMeta.dental?.bookingPublicKeyVersion ?? null;
  return { publicKeyPem, keyVersion };
}

/**
 * Loads the practice RSA public key used for token-booking sealing.
 * Prefers PracticeEncryptionKey.bookingPublicKeyPem; falls back to Team.metadata.dental.
 */
export async function resolvePracticeBookingPublicKey(
  teamId: number | null | undefined
): Promise<PracticeBookingPublicKey | null> {
  if (!teamId || !isDentalComplianceMode()) {
    return null;
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      metadata: true,
      practiceEncryptionKey: {
        select: {
          keyVersion: true,
          isActive: true,
          bookingPublicKeyPem: true,
        },
      },
    },
  });

  if (!team) {
    return null;
  }

  const fromKeyTable = team.practiceEncryptionKey?.bookingPublicKeyPem?.trim();
  const fromMetadata = resolvePublicKeyFromMetadata(team.metadata);
  const publicKeyPem = fromKeyTable || fromMetadata.publicKeyPem;

  if (!publicKeyPem) {
    return null;
  }

  const keyVersion =
    fromMetadata.keyVersion ??
    team.practiceEncryptionKey?.keyVersion ??
    1;

  return {
    teamId: team.id,
    publicKeyPem,
    keyVersion,
  };
}

export type SetPracticeBookingPublicKeyInput = {
  teamId: number;
  publicKeyPem: string;
  keyVersion?: number;
};

/**
 * Stores practice RSA public key on PracticeEncryptionKey (creates row if needed via upsert).
 * Also clears legacy Team.metadata.dental.bookingPublicKeyPem after migration.
 */
export async function setPracticeBookingPublicKey(
  input: SetPracticeBookingPublicKeyInput
): Promise<{ fingerprint: string; keyVersion: number }> {
  const trimmed = input.publicKeyPem.trim();
  const fingerprint = computePublicKeyFingerprint(trimmed);
  const keyVersion = input.keyVersion ?? 1;
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await getPracticeKeyResolver(tx as never).resolve(input.teamId);

    await tx.practiceEncryptionKey.update({
      where: { teamId: input.teamId },
      data: {
        bookingPublicKeyPem: trimmed,
        publicKeyFingerprint: fingerprint,
        publicKeyRotatedAt: now,
        keyVersion,
      },
    });

    const team = await tx.team.findUnique({
      where: { id: input.teamId },
      select: { metadata: true },
    });

    if (team?.metadata && typeof team.metadata === "object") {
      const meta = { ...(team.metadata as Record<string, unknown>) };
      const dental =
        meta.dental && typeof meta.dental === "object"
          ? { ...(meta.dental as Record<string, unknown>) }
          : {};

      delete dental.bookingPublicKeyPem;
      delete dental.bookingPublicKeyVersion;

      if (Object.keys(dental).length > 0) {
        meta.dental = dental;
      } else {
        delete meta.dental;
      }

      await tx.team.update({
        where: { id: input.teamId },
        data: { metadata: meta as Prisma.InputJsonValue },
      });
    }
  });

  return { fingerprint, keyVersion };
}

export async function getPracticeBookingPublicKeyInfo(teamId: number): Promise<{
  configured: boolean;
  fingerprint: string | null;
  keyVersion: number | null;
  rotatedAt: Date | null;
}> {
  const row = await prisma.practiceEncryptionKey.findUnique({
    where: { teamId },
    select: {
      bookingPublicKeyPem: true,
      publicKeyFingerprint: true,
      keyVersion: true,
      publicKeyRotatedAt: true,
    },
  });

  if (!row?.bookingPublicKeyPem) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { metadata: true },
    });
    const legacy = resolvePublicKeyFromMetadata(team?.metadata);
    if (legacy.publicKeyPem) {
      return {
        configured: true,
        fingerprint: computePublicKeyFingerprint(legacy.publicKeyPem),
        keyVersion: legacy.keyVersion,
        rotatedAt: null,
      };
    }

    return {
      configured: false,
      fingerprint: null,
      keyVersion: null,
      rotatedAt: null,
    };
  }

  return {
    configured: true,
    fingerprint: row.publicKeyFingerprint,
    keyVersion: row.keyVersion,
    rotatedAt: row.publicKeyRotatedAt,
  };
}
