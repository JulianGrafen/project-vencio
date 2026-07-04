import { TRPCError } from "@trpc/server";

import { SmartFillDashboardService } from "@calcom/lib/dental/smart-fill";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { SmartFillPatientService } from "@calcom/lib/dental/smart-fill/smart-fill-patient.service";
import { prisma } from "@calcom/prisma";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { dentalTeamMemberProcedure } from "../../../procedures/dentalTeamMemberProcedure";
import { router } from "../../../trpc";
import {
  ZSmartFillDashboardInput,
  ZSmartFillPatientCreateInput,
  ZSmartFillPatientDeleteInput,
  ZSmartFillPatientListInput,
  ZSmartFillPatientUpdateInput,
} from "./_schemas";

const patientService = new SmartFillPatientService(prisma);

async function requireTeamPatient(teamId: number, patientId: string) {
  const patient = await patientService.findByTeam(teamId, patientId);
  if (!patient) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return patient;
}

export const smartFillRouter = router({
  dashboard: dentalTeamMemberProcedure(ZSmartFillDashboardInput).query(async ({ input }) => {
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

  listPatients: dentalTeamMemberProcedure(ZSmartFillPatientListInput).query(async ({ input }) => {
    return patientService.listByTeam(input.teamId);
  }),

  createPatient: dentalTeamAdminProcedure(ZSmartFillPatientCreateInput).mutation(async ({ input }) => {
    return patientService.create(input);
  }),

  updatePatient: dentalTeamAdminProcedure(ZSmartFillPatientUpdateInput).mutation(async ({ input }) => {
    await requireTeamPatient(input.teamId, input.patientId);
    return patientService.update(input);
  }),

  deletePatient: dentalTeamAdminProcedure(ZSmartFillPatientDeleteInput).mutation(async ({ input }) => {
    await requireTeamPatient(input.teamId, input.patientId);
    await patientService.delete(input.teamId, input.patientId);
    return { success: true as const };
  }),
});
