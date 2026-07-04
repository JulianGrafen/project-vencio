import { z } from "zod";

import { PracticeTrialService } from "@calcom/lib/dental/trial/trial.service";
import { isPracticeTrialEnabled } from "@calcom/lib/dental/trial/trial-feature-flags";
import { prisma } from "@calcom/prisma";

import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";

const ZTrialStatusInput = z.object({
  teamId: z.number().int().positive().optional(),
});

export const practiceTrialRouter = router({
  status: authedProcedure.input(ZTrialStatusInput).query(async ({ ctx, input }) => {
    if (!isPracticeTrialEnabled()) {
      return { enabled: false as const };
    }

    const service = new PracticeTrialService(prisma);
    const eligibility = input.teamId
      ? await service.getEligibilityForTeam(input.teamId)
      : await service.getEligibilityForUser(ctx.user.id);

    if (!eligibility) {
      return { enabled: true as const, hasPractice: false as const };
    }

    const teamId =
      "teamId" in eligibility ? eligibility.teamId : (input.teamId ?? null);

    return {
      enabled: true as const,
      hasPractice: true as const,
      teamId,
      eligible: eligibility.eligible,
      isExpired: eligibility.isExpired,
      daysRemaining: eligibility.daysRemaining,
      bookingsRemaining: eligibility.bookingsRemaining,
      trialBookingsCount: eligibility.trialBookingsCount,
      trialEndsAt: eligibility.trialEndsAt?.toISOString() ?? null,
      reason: eligibility.reason,
    };
  }),
});
