import { TRPCError } from "@trpc/server";

import { PracticeTrialService } from "@calcom/lib/dental/trial/trial.service";
import { isPracticeTrialEnabled } from "@calcom/lib/dental/trial/trial-feature-flags";
import { prisma } from "@calcom/prisma";

import { middleware } from "../trpc";

/**
 * Blocks core dental mutations when the practice trial has expired.
 */
export const dentalTrialMiddleware = middleware(async ({ input, next }) => {
  if (!isPracticeTrialEnabled()) {
    return next();
  }

  const teamId =
    typeof input === "object" && input !== null && "teamId" in input
      ? (input as { teamId: number }).teamId
      : null;

  if (!teamId) {
    return next();
  }

  const service = new PracticeTrialService(prisma);
  const eligibility = await service.getEligibilityForTeam(teamId);

  if (eligibility?.isExpired) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Ihre Testphase ist abgelaufen. Bitte upgraden Sie auf die Vollversion.",
    });
  }

  return next();
});
