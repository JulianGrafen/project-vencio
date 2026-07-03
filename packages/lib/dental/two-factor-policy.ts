import { prisma } from "@calcom/prisma";
import { IdentityProvider, MembershipRole } from "@calcom/prisma/enums";

import { isDentalComplianceMode } from "./compliance-config";
import { DENTAL_ENV, parseBooleanEnv } from "./env";

/**
 * Whether practice OWNER/ADMIN accounts must enable app-based 2FA.
 * Defaults to true when dental compliance mode is active.
 */
export function isDentalTwoFactorRequired(): boolean {
  const explicit = process.env[DENTAL_ENV.REQUIRE_2FA];
  if (explicit !== undefined) {
    return parseBooleanEnv(explicit);
  }
  return isDentalComplianceMode();
}

export function canUseAppTwoFactor(identityProvider: IdentityProvider): boolean {
  return identityProvider === IdentityProvider.CAL;
}

export async function isPracticeAdminUser(userId: number): Promise<boolean> {
  const count = await prisma.membership.count({
    where: {
      userId,
      accepted: true,
      role: { in: [MembershipRole.ADMIN, MembershipRole.OWNER] },
    },
  });

  return count > 0;
}

export async function isDentalTwoFactorSetupRequiredForUser(params: {
  userId: number;
  twoFactorEnabled: boolean;
  identityProvider: IdentityProvider;
}): Promise<boolean> {
  if (!isDentalTwoFactorRequired()) {
    return false;
  }

  if (params.twoFactorEnabled || !canUseAppTwoFactor(params.identityProvider)) {
    return false;
  }

  return isPracticeAdminUser(params.userId);
}

export async function isDentalTwoFactorDisableBlockedForUser(params: {
  userId: number;
  identityProvider: IdentityProvider;
}): Promise<boolean> {
  if (!isDentalTwoFactorRequired() || !canUseAppTwoFactor(params.identityProvider)) {
    return false;
  }

  return isPracticeAdminUser(params.userId);
}
