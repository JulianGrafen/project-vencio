import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import dayjs from "@calcom/dayjs";

export type SmartFillDashboardStats = {
  filledToday: number;
  revenueSecuredCents: number;
  pendingInvites: number;
  openSlots: number;
};

/**
 * Aggregates Smart-Fill KPIs for the practice dashboard card.
 */
export class SmartFillDashboardService {
  constructor(private readonly prisma: PrismaClient) {}

  async getStatsForTeam(teamId: number): Promise<SmartFillDashboardStats> {
    const startOfDay = dayjs().startOf("day").toDate();
    const endOfDay = dayjs().endOf("day").toDate();

    const [confirmedToday, pendingInvites, openSlots] = await Promise.all([
      this.prisma.smartFillTask.findMany({
        where: {
          teamId,
          status: SmartFillTaskStatus.CONFIRMED,
          updatedAt: { gte: startOfDay, lte: endOfDay },
        },
        select: { estimatedRevenueCents: true },
      }),
      this.prisma.smartFillInvite.count({
        where: {
          task: { teamId, status: SmartFillTaskStatus.INVITED },
          status: { in: [SmartFillInviteStatus.SENT, SmartFillInviteStatus.DELIVERED] },
        },
      }),
      this.prisma.smartFillTask.count({
        where: {
          teamId,
          status: { in: [SmartFillTaskStatus.PENDING, SmartFillTaskStatus.INVITED] },
          startTime: { gt: new Date() },
        },
      }),
    ]);

    const revenueSecuredCents = confirmedToday.reduce(
      (sum, t) => sum + (t.estimatedRevenueCents ?? 0),
      0
    );

    return {
      filledToday: confirmedToday.length,
      revenueSecuredCents,
      pendingInvites,
      openSlots,
    };
  }
}
