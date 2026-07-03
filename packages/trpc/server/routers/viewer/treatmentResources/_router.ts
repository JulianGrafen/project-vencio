import { MembershipRole } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";

const ZListInput = z.object({
  teamId: z.number(),
});

const ZCreateInput = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["CHAIR", "ROOM", "XRAY"]).default("CHAIR"),
});

export const treatmentResourcesRouter = router({
  list: authedProcedure.input(ZListInput).query(async ({ ctx, input }) => {
    const { prisma } = await import("@calcom/prisma");
    const membership = await prisma.membership.findFirst({
      where: {
        teamId: input.teamId,
        userId: ctx.user.id,
        accepted: true,
      },
    });

    if (!membership) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

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
    const { prisma } = await import("@calcom/prisma");
    const membership = await prisma.membership.findFirst({
      where: {
        teamId: input.teamId,
        userId: ctx.user.id,
        accepted: true,
        role: { in: [MembershipRole.ADMIN, MembershipRole.OWNER] },
      },
    });

    if (!membership) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return prisma.treatmentResource.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        slug: input.slug,
        type: input.type,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
      },
    });
  }),
});
