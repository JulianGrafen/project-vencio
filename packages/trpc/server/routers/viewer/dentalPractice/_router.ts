import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import {
  mergeDentalTeamMetadata,
  parseDentalTeamMetadata,
  resolveDentalPracticeInfo,
} from "@calcom/lib/dental/team-metadata";
import { TRPCError } from "@trpc/server";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { dentalTeamMemberProcedure } from "../../../procedures/dentalTeamMemberProcedure";
import { router } from "../../../trpc";
import { ZDentalPracticeGetInput, ZDentalPracticeUpdateInput } from "./_schemas";

export const dentalPracticeRouter = router({
  get: dentalTeamMemberProcedure(ZDentalPracticeGetInput).query(async ({ input }) => {
    const team = await prisma.team.findUnique({
      where: { id: input.teamId },
      select: { name: true, metadata: true },
    });

    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const dental = parseDentalTeamMetadata(team.metadata);

    return {
      ...resolveDentalPracticeInfo({
        teamName: team.name,
        teamMetadata: team.metadata,
      }),
      dental,
    };
  }),

  update: dentalTeamAdminProcedure(ZDentalPracticeUpdateInput).mutation(async ({ input }) => {
    const team = await prisma.team.findUnique({
      where: { id: input.teamId },
      select: { id: true, metadata: true },
    });

    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const metadata = mergeDentalTeamMetadata(team.metadata as Record<string, unknown>, {
      practiceName: input.practiceName,
      practiceAddress: input.practiceAddress,
      emergencyPhone: input.emergencyPhone,
    });

    const updated = await prisma.team.update({
      where: { id: input.teamId },
      data: { metadata: metadata as Prisma.InputJsonValue },
      select: { name: true, metadata: true },
    });

    return resolveDentalPracticeInfo({
      teamName: updated.name,
      teamMetadata: updated.metadata,
    });
  }),
});
