import type { z } from "zod";

import { assertAcceptedTeamMembership } from "@calcom/lib/dental/assert-team-membership";

import { dentalAuthedProcedure } from "./dentalAuthedProcedure";

type TeamScopedInput = {
  teamId: number;
};

/**
 * Dental authed procedure with validated input, 2FA gate, and accepted team membership.
 */
export function dentalTeamMemberProcedure<TSchema extends z.ZodType<TeamScopedInput>>(schema: TSchema) {
  return dentalAuthedProcedure.input(schema).use(async ({ ctx, input, next }) => {
    await assertAcceptedTeamMembership(ctx.user.id, input.teamId);
    return next();
  });
}
