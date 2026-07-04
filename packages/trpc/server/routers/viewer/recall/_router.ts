import { RecallPendingService } from "@calcom/lib/dental/recall";
import { RecallConversionService } from "@calcom/lib/dental/recall/recall-conversion.service";
import { RecallSettingsService } from "@calcom/lib/dental/recall/recall-settings.service";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { prisma } from "@calcom/prisma";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { dentalTeamMemberProcedure } from "../../../procedures/dentalTeamMemberProcedure";
import { router } from "../../../trpc";
import { ZRecallHistoryInput, ZRecallPendingInput, ZRecallSettingsUpdateInput } from "./_schemas";

const pendingService = new RecallPendingService(prisma);
const settingsService = new RecallSettingsService(prisma);
const conversionService = new RecallConversionService(prisma);

export const recallRouter = router({
  /** Pending recalls for the upcoming week — practice dashboard. */
  pending: dentalTeamMemberProcedure(ZRecallPendingInput).query(async ({ input }) => {
    if (!isRecallEnabled()) {
      return { enabled: false as const, items: [] as const };
    }

    const items = await pendingService.listPendingForTeam(input.teamId);
    return { enabled: true as const, items };
  }),

  /** Monthly KPI: recalls sent and bookings generated via recall links. */
  stats: dentalTeamMemberProcedure(ZRecallPendingInput).query(async ({ input }) => {
    if (!isRecallEnabled()) {
      return { enabled: false as const, sentThisMonth: 0, convertedThisMonth: 0 };
    }

    const stats = await conversionService.getMonthlyStats(input.teamId);
    return { enabled: true as const, ...stats };
  }),

  /** Recent recall history for audit / accountability. */
  history: dentalTeamMemberProcedure(ZRecallHistoryInput).query(async ({ input }) => {
    const limit = input.limit ?? 50;

    const rows = await prisma.recallHistory.findMany({
      where: { teamId: input.teamId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        channel: true,
        status: true,
        recallDueDate: true,
        sentAt: true,
        error: true,
        createdAt: true,
        patient: { select: { name: true, email: true } },
      },
    });

    return rows;
  }),

  getSettings: dentalTeamMemberProcedure(ZRecallPendingInput).query(async ({ input }) => {
    return settingsService.getOrCreateForTeam(input.teamId);
  }),

  updateSettings: dentalTeamAdminProcedure(ZRecallSettingsUpdateInput).mutation(async ({ input }) => {
    const { teamId, ...data } = input;
    await settingsService.getOrCreateForTeam(teamId);

    return prisma.recallSettings.update({
      where: { teamId },
      data,
    });
  }),
});
