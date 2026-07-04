import { PvsConnectorCredentialService } from "@calcom/lib/dental/pvs/pvs-connector-credential.service";
import { assertAdminOrOwnerTeamMembership } from "@calcom/lib/dental/assert-team-membership";
import { prisma } from "@calcom/prisma";

import { dentalAdminProcedure } from "../../../procedures/dentalAuthedProcedure";
import { router } from "../../../trpc";
import { ZPvsConnectorCreateInput, ZPvsConnectorListInput, ZPvsConnectorRevokeInput } from "./_schemas";

const credentialService = new PvsConnectorCredentialService(prisma);

export const pvsConnectorRouter = router({
  listCredentials: dentalAdminProcedure.input(ZPvsConnectorListInput).query(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);
    return credentialService.listByTeam(input.teamId);
  }),

  createCredential: dentalAdminProcedure.input(ZPvsConnectorCreateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);
    return credentialService.create(input.teamId, input.label);
  }),

  revokeCredential: dentalAdminProcedure.input(ZPvsConnectorRevokeInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);
    const credential = await credentialService.revoke(input.teamId, input.credentialId);
    return { success: true as const, credential };
  }),
});
