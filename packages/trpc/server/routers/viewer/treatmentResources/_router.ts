import { MembershipRole } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import authedProcedure from "../../../procedures/authedProcedure";
import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";

const ZListInput = z.object({
  teamId: z.number(),
});

const ZListForEventTypeInput = z.object({
  eventTypeId: z.number(),
});

const ZCreateInput = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["CHAIR", "ROOM", "XRAY"]).default("CHAIR"),
  scheduleId: z.number().optional(),
});

const ZUpdateInput = z.object({
  resourceId: z.string(),
  teamId: z.number(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: z.enum(["CHAIR", "ROOM", "XRAY"]).optional(),
  scheduleId: z.number().nullable().optional(),
});

const ZDeactivateInput = z.object({
  resourceId: z.string(),
  teamId: z.number(),
});

async function assertTeamMembership(userId: number, teamId: number, adminOnly = false) {
  const { prisma } = await import("@calcom/prisma");
  const membership = await prisma.membership.findFirst({
    where: {
      teamId,
      userId,
      accepted: true,
      ...(adminOnly ? { role: { in: [MembershipRole.ADMIN, MembershipRole.OWNER] } } : {}),
    },
  });

  if (!membership) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
}

export const treatmentResourcesRouter = router({
  /** Public endpoint for the booker — lists active resources for an event type's practice. */
  listForEventType: publicProcedure.input(ZListForEventTypeInput).query(async ({ input }) => {
    const { prisma } = await import("@calcom/prisma");

    const eventType = await prisma.eventType.findUnique({
      where: { id: input.eventTypeId },
      select: { teamId: true },
    });

    if (!eventType?.teamId) {
      return [];
    }

    return prisma.treatmentResource.findMany({
      where: { teamId: eventType.teamId, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        scheduleId: true,
      },
    });
  }),

  list: authedProcedure.input(ZListInput).query(async ({ ctx, input }) => {
    await assertTeamMembership(ctx.user.id, input.teamId);

    const { prisma } = await import("@calcom/prisma");
    return prisma.treatmentResource.findMany({
      where: { teamId: input.teamId, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        isActive: true,
        scheduleId: true,
      },
    });
  }),

  create: authedProcedure.input(ZCreateInput).mutation(async ({ ctx, input }) => {
    await assertTeamMembership(ctx.user.id, input.teamId, true);

    const { prisma } = await import("@calcom/prisma");
    return prisma.treatmentResource.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        slug: input.slug,
        type: input.type,
        scheduleId: input.scheduleId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        scheduleId: true,
      },
    });
  }),

  update: authedProcedure.input(ZUpdateInput).mutation(async ({ ctx, input }) => {
    await assertTeamMembership(ctx.user.id, input.teamId, true);

    const { prisma } = await import("@calcom/prisma");
    const resource = await prisma.treatmentResource.findFirst({
      where: { id: input.resourceId, teamId: input.teamId },
    });

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
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        scheduleId: true,
        isActive: true,
      },
    });
  }),

  deactivate: authedProcedure.input(ZDeactivateInput).mutation(async ({ ctx, input }) => {
    await assertTeamMembership(ctx.user.id, input.teamId, true);

    const { prisma } = await import("@calcom/prisma");
    const resource = await prisma.treatmentResource.findFirst({
      where: { id: input.resourceId, teamId: input.teamId },
    });

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
