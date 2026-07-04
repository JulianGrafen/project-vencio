import type { z } from "zod";

import { assertAcceptedTeamMembership } from "@calcom/lib/dental/assert-team-membership";

import { dentalAuthedProcedure } from "./dentalAuthedProcedure";
import { dentalTrialMiddleware } from "../middlewares/dentalTrialMiddleware";

type TeamScopedInput = {
  teamId: number;
};

/**
 * Dental authed procedure with validated input, 2FA gate, and accepted team membership.
 */
export function dentalTeamMemberProcedure<TSchema extends z.ZodType<TeamScopedInput>>(schema: TSchema) {
  return dentalAuthedProcedure
    .input(schema)
    .use(dentalTrialMiddleware as never)
    .use((async (opts: unknown) => {
      const { ctx, input, next } = opts as {
        ctx: { user: { id: number } };
        input: TeamScopedInput;
        next: () => Promise<unknown>;
      };
      await assertAcceptedTeamMembership(ctx.user.id, input.teamId);
      return next();
    }) as never);
}
