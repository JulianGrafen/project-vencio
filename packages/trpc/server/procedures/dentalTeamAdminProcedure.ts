import type { z } from "zod";

import { assertAdminOrOwnerTeamMembership } from "@calcom/lib/dental/assert-team-membership";

import { dentalAdminProcedure } from "./dentalAuthedProcedure";
import { dentalTrialMiddleware } from "../middlewares/dentalTrialMiddleware";

type TeamScopedInput = {
  teamId: number;
};

/**
 * Dental admin procedure with validated input and OWNER/ADMIN membership for `teamId`.
 * Input must be registered before the membership middleware runs.
 */
export function dentalTeamAdminProcedure<TSchema extends z.ZodType<TeamScopedInput>>(schema: TSchema) {
  return dentalAdminProcedure.input(schema).use(async ({ ctx, input, next }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);
    return next();
  });
}
