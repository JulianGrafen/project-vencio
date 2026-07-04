import prisma from "@calcom/prisma";

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

/**
 * Loads the practice RSA public key used for token-booking sealing.
 * Cloud stores only the public key — decryption requires the on-prem private key.
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
        select: { keyVersion: true, isActive: true },
      },
    },
  });

  if (!team) {
    return null;
  }

  const dentalMeta = (team.metadata ?? {}) as DentalTeamMetadata;
  const publicKeyPem = dentalMeta.dental?.bookingPublicKeyPem?.trim();

  if (!publicKeyPem) {
    return null;
  }

  const keyVersion =
    dentalMeta.dental?.bookingPublicKeyVersion ?? team.practiceEncryptionKey?.keyVersion ?? 1;

  return {
    teamId: team.id,
    publicKeyPem,
    keyVersion,
  };
}
