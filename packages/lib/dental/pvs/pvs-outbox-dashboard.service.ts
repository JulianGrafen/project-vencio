import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOutboxStatus } from "@calcom/prisma/enums";

const RECENT_JOB_LIMIT = 25;

export type PvsOutboxJobSummary = {
  id: string;
  bookingUid: string;
  operation: string;
  status: string;
  attempts: number;
  lastError: string | null;
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PvsOutboxDashboardStats = {
  pending: number;
  processing: number;
  failed: number;
  completed: number;
  recentJobs: PvsOutboxJobSummary[];
};

export class PvsOutboxDashboardService {
  constructor(private readonly prisma: PrismaClient) {}

  async getStatsForTeam(teamId: number): Promise<PvsOutboxDashboardStats> {
    const [pending, processing, failed, completed, recentJobs] = await Promise.all([
      this.prisma.pvsSyncOutbox.count({
        where: { teamId, status: PvsSyncOutboxStatus.PENDING },
      }),
      this.prisma.pvsSyncOutbox.count({
        where: { teamId, status: PvsSyncOutboxStatus.PROCESSING },
      }),
      this.prisma.pvsSyncOutbox.count({
        where: { teamId, status: PvsSyncOutboxStatus.FAILED },
      }),
      this.prisma.pvsSyncOutbox.count({
        where: { teamId, status: PvsSyncOutboxStatus.COMPLETED },
      }),
      this.prisma.pvsSyncOutbox.findMany({
        where: { teamId },
        orderBy: { updatedAt: "desc" },
        take: RECENT_JOB_LIMIT,
        select: {
          id: true,
          bookingUid: true,
          operation: true,
          status: true,
          attempts: true,
          lastError: true,
          externalId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { pending, processing, failed, completed, recentJobs };
  }
}
