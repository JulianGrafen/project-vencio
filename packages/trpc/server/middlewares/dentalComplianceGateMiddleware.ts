import { TRPCError } from "@trpc/server";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";

import { middleware } from "../trpc";

/**
 * Blocks Cal.com features that are irrelevant or incompatible with teeth.al dental compliance mode.
 */
export const dentalComplianceGateMiddleware = middleware(async ({ next }) => {
  if (isDentalComplianceMode()) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Dieses Feature ist im Dental-Modus nicht verfügbar.",
    });
  }

  return next();
});
