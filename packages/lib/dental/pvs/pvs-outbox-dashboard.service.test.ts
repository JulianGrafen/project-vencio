import { describe, expect, it, vi } from "vitest";

import { PvsSyncOutboxStatus } from "@calcom/prisma/enums";

import { PvsOutboxDashboardService } from "./pvs-outbox-dashboard.service";

describe("PvsOutboxDashboardService", () => {
  it("aggregates outbox counts and recent jobs", async () => {
    const recentJobs = [
      {
        id: "job-1",
        bookingUid: "uid-1",
        operation: "CREATE_APPOINTMENT",
        status: PvsSyncOutboxStatus.PENDING,
        attempts: 0,
        lastError: null,
        externalId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const prisma = {
      pvsSyncOutbox: {
        count: vi
          .fn()
          .mockResolvedValueOnce(3)
          .mockResolvedValueOnce(1)
          .mockResolvedValueOnce(2)
          .mockResolvedValueOnce(10),
        findMany: vi.fn().mockResolvedValue(recentJobs),
      },
    };

    const service = new PvsOutboxDashboardService(prisma as never);
    const stats = await service.getStatsForTeam(42);

    expect(stats.pending).toBe(3);
    expect(stats.processing).toBe(1);
    expect(stats.failed).toBe(2);
    expect(stats.completed).toBe(10);
    expect(stats.recentJobs).toHaveLength(1);
  });
});
