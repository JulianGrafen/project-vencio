import { PvsConnectorCredentialService } from "@calcom/lib/dental/pvs/pvs-connector-credential.service";
import { PvsOutboxDashboardService } from "@calcom/lib/dental/pvs/pvs-outbox-dashboard.service";
import { prisma } from "@calcom/prisma";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { router } from "../../../trpc";
import {
  ZPvsConnectorCreateInput,
  ZPvsConnectorDashboardInput,
  ZPvsConnectorListInput,
  ZPvsConnectorRevokeInput,
} from "./_schemas";

const credentialService = new PvsConnectorCredentialService(prisma);
const outboxDashboardService = new PvsOutboxDashboardService(prisma);

export const pvsConnectorRouter = router({
  dashboard: dentalTeamAdminProcedure.input(ZPvsConnectorDashboardInput).query(async ({ input }) => {
    return outboxDashboardService.getStatsForTeam(input.teamId);
  }),

  listCredentials: dentalTeamAdminProcedure.input(ZPvsConnectorListInput).query(async ({ input }) => {
    return credentialService.listByTeam(input.teamId);
  }),

  createCredential: dentalTeamAdminProcedure.input(ZPvsConnectorCreateInput).mutation(async ({ input }) => {
    return credentialService.create(input.teamId, input.label);
  }),

  revokeCredential: dentalTeamAdminProcedure.input(ZPvsConnectorRevokeInput).mutation(async ({ input }) => {
    const credential = await credentialService.revoke(input.teamId, input.credentialId);
    return { success: true as const, credential };
  }),
});
