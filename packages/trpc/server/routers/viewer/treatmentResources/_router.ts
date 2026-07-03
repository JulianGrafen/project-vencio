import { prisma } from "@calcom/prisma";
import {
  TREATMENT_RESOURCE_ADMIN_LIST_SELECT,
  TREATMENT_RESOURCE_LIST_SELECT,
} from "@calcom/lib/dental/constants";
import {
  assertAcceptedTeamMembership,
  assertAdminOrOwnerTeamMembership,
} from "@calcom/lib/dental/assert-team-membership";
import { resolveTeamIdFromEventTypeId } from "@calcom/lib/dental/practice-team-resolver";
import { TRPCError } from "@trpc/server";

import authedProcedure from "../../../procedures/authedProcedure";
import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";
import {
  ZTreatmentResourceCreateInput,
  ZTreatmentResourceDeactivateInput,
  ZTreatmentResourceListForEventTypeInput,
  ZTreatmentResourceListInput,
  ZTreatmentResourceUpdateInput,
} from "./_schemas";

async function findTeamResource(resourceId: string, teamId: number) {
  return prisma.treatmentResource.findFirst({
    where: { id: resourceId, teamId },
  });
}

export const treatmentResourcesRouter = router({
  /** Public endpoint for the booker — lists active resources for an event type's practice. */
  listForEventType: publicProcedure
    .input(ZTreatmentResourceListForEventTypeInput)
    .query(async ({ input }) => {
      const teamId = await resolveTeamIdFromEventTypeId(prisma, input.eventTypeId);
      if (!teamId) {
        return [];
      }

      return prisma.treatmentResource.findMany({
        where: { teamId, isActive: true },
        orderBy: { name: "asc" },
        select: TREATMENT_RESOURCE_LIST_SELECT,
      });
    }),

  list: authedProcedure.input(ZTreatmentResourceListInput).query(async ({ ctx, input }) => {
    await assertAcceptedTeamMembership(ctx.user.id, input.teamId);

    return prisma.treatmentResource.findMany({
      where: { teamId: input.teamId, isActive: true },
      orderBy: { name: "asc" },
      select: TREATMENT_RESOURCE_ADMIN_LIST_SELECT,
    });
  }),

  create: authedProcedure.input(ZTreatmentResourceCreateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    return prisma.treatmentResource.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        slug: input.slug,
        type: input.type,
        scheduleId: input.scheduleId,
      },
      select: TREATMENT_RESOURCE_LIST_SELECT,
    });
  }),

  update: authedProcedure.input(ZTreatmentResourceUpdateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    const resource = await findTeamResource(input.resourceId, input.teamId);
    if (!resource) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return prisma.treatmentResource.update({
      where: { id: input.resourceId },
      data: {
        name: input.name,
        slug: input.slug,
        type: input.type,
        scheduleId: input.scheduleId,
      },
      select: TREATMENT_RESOURCE_ADMIN_LIST_SELECT,
    });
  }),

  deactivate: authedProcedure.input(ZTreatmentResourceDeactivateInput).mutation(async ({ ctx, input }) => {
    await assertAdminOrOwnerTeamMembership(ctx.user.id, input.teamId);

    const resource = await findTeamResource(input.resourceId, input.teamId);
    if (!resource) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return prisma.treatmentResource.update({
      where: { id: input.resourceId },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
  }),
});
