import { TRPCError } from "@trpc/server";

import { SmartFillDashboardService } from "@calcom/lib/dental/smart-fill";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { normalizePhoneNumber } from "@calcom/lib/dental/smart-fill/phone-utils";
import {
  assertAcceptedTeamMembership,
  assertAdminOrOwnerTeamMembership,
} from "@calcom/lib/dental/assert-team-membership";
import { prisma } from "@calcom/prisma";

import authedProcedure from "../../../procedures/authedProcedure";
import { dentalAdminProcedure } from "../../../procedures/dentalAuthedProcedure";
import { router } from "../../../trpc";
import {
  ZSmartFillDashboardInput,
  ZSmartFillPatientCreateInput,
  ZSmartFillPatientDeleteInput,
  ZSmartFillPatientListInput,
  ZSmartFillPatientUpdateInput,
} from "./_schemas";

const patientSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  waitlistEnabled: true,
  lastVisitAt: true,
  priorityScore: true,
  preferredEventTypeId: true,
  createdAt: true,
} as const;

async function findTeamPatient(patientId: string, teamId: number) {
  return prisma.smartFillPatient.findFirst({
    where: { id: patientId, teamId },
  });
}

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

  listPatients: authedProcedure.input(ZSmartFillPatientListInput).query(async ({ ctx, input }) => {
    await assertAcceptedTeamMembership(ctx.user.id, input.teamId);

    return prisma.smartFillPatient.findMany({
      where: { teamId: input.teamId },
      orderBy: [{ waitlistEnabled: "desc" }, { priorityScore: "desc" }, { name: "asc" }],
      select: patientSelect,
    });
  }),

  createPatient: dentalAdminProcedure.input(ZSmartFillPatientCreateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    return prisma.smartFillPatient.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        email: input.email,
        phoneNumber: normalizePhoneNumber(input.phoneNumber),
        waitlistEnabled: input.waitlistEnabled,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId ?? null,
      },
      select: patientSelect,
    });
  }),

  updatePatient: dentalAdminProcedure.input(ZSmartFillPatientUpdateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    const patient = await findTeamPatient(input.patientId, input.teamId);
    if (!patient) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return prisma.smartFillPatient.update({
      where: { id: input.patientId },
      data: {
        name: input.name,
        email: input.email,
        phoneNumber: input.phoneNumber ? normalizePhoneNumber(input.phoneNumber) : undefined,
        waitlistEnabled: input.waitlistEnabled,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId,
      },
      select: patientSelect,
    });
  }),

  deletePatient: dentalAdminProcedure.input(ZSmartFillPatientDeleteInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    const patient = await findTeamPatient(input.patientId, input.teamId);
    if (!patient) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    await prisma.smartFillPatient.delete({ where: { id: input.patientId } });
    return { success: true as const };
  }),
});
