import { TRPCError } from "@trpc/server";

import { assertAdminOrOwnerTeamMembership } from "@calcom/lib/dental/assert-team-membership";

import { dentalAdminProcedure } from "./dentalAuthedProcedure";

type TeamScopedInput = {
  teamId?: unknown;
};

/**
 * Dental admin procedure that also verifies OWNER/ADMIN membership for `input.teamId`.
 */
export const dentalTeamAdminProcedure = dentalAdminProcedure.use(async ({ ctx, input, next }) => {
  const teamId = (input as TeamScopedInput).teamId;

  if (typeof teamId !== "number" || teamId <= 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "teamId is required",
    });
  }

  await assertAdminOrOwnerTeamMembership(ctx.user.id, teamId);

  return next();
});
