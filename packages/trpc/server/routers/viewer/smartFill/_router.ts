import { z } from "zod";

import { SmartFillDashboardService } from "@calcom/lib/dental/smart-fill";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { assertAcceptedTeamMembership } from "@calcom/lib/dental/assert-team-membership";
import { prisma } from "@calcom/prisma";

import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";

const ZSmartFillDashboardInput = z.object({
  teamId: z.number(),
});

export const smartFillRouter = router({
  dashboard: authedProcedure.input(ZSmartFillDashboardInput).query(async ({ ctx, input }) => {
    await assertAcceptedTeamMembership(ctx.user.id, input.teamId);

    if (!isSmartFillEnabled()) {
      return {
        enabled: false as const,
        filledToday: 0,
        revenueSecuredCents: 0,
        pendingInvites: 0,
        openSlots: 0,
      };
    }

    const service = new SmartFillDashboardService(prisma);
    const stats = await service.getStatsForTeam(input.teamId);

    return { enabled: true as const, ...stats };
  }),
});
