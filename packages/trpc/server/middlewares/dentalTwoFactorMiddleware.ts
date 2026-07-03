import { TRPCError } from "@trpc/server";

import {
  assertDentalTwoFactorEnabledForUser,
  DentalTwoFactorRequiredError,
} from "@calcom/lib/dental/assert-two-factor-enabled";

import { middleware } from "../trpc";

/**
 * Blocks dental admin mutations until TOTP 2FA is enabled (compliance mode).
 */
export const dentalTwoFactorMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    return next();
  }

  try {
    await assertDentalTwoFactorEnabledForUser({
      id: ctx.user.id,
      twoFactorEnabled: ctx.user.twoFactorEnabled,
      identityProvider: ctx.user.identityProvider,
    });
  } catch (error) {
    if (error instanceof DentalTwoFactorRequiredError) {
      throw new TRPCError({ code: "FORBIDDEN", message: error.message });
    }
    throw error;
  }

  return next();
});
