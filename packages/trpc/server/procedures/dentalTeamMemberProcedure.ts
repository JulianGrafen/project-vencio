import type { z } from "zod";

import { assertAcceptedTeamMembership } from "@calcom/lib/dental/assert-team-membership";

import authedProcedure from "./authedProcedure";

type TeamScopedInput = {
  teamId: number;
};

/**
 * Authed procedure with validated input and accepted team membership for `teamId`.
 */
export function dentalTeamMemberProcedure<TSchema extends z.ZodType<TeamScopedInput>>(schema: TSchema) {
  return authedProcedure.input(schema).use(async ({ ctx, input, next }) => {
    await assertAcceptedTeamMembership(ctx.user.id, input.teamId);
    return next();
  });
}
