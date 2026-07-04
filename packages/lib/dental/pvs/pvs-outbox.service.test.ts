import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { PvsSyncOutboxStatus } from "@calcom/prisma/enums";

import { PVS_OUTBOX_MAX_ATTEMPTS } from "./pvs-outbox.constants";
import { PvsOutboxNotFoundError, PvsOutboxService } from "./pvs-outbox.service";

describe("PvsOutboxService", () => {
  const now = new Date("2026-07-04T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("claims pending jobs and marks them PROCESSING", async () => {
    const findMany = vi
      .fn()
      .mockResolvedValueOnce([
        {
          id: "job-1",
          teamId: 7,
          bookingUid: "uid-1",
          operation: "CREATE_APPOINTMENT",
          payload: { bookingUid: "uid-1", teamId: 7 },
          attempts: 0,
          createdAt: now,
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "job-1",
          teamId: 7,
          bookingUid: "uid-1",
          operation: "CREATE_APPOINTMENT",
          payload: { bookingUid: "uid-1", teamId: 7 },
          attempts: 1,
          createdAt: now,
        },
      ]);

    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const prisma = {
      pvsSyncOutbox: { findMany, updateMany, findFirst: vi.fn(), update: vi.fn() },
    };

    const service = new PvsOutboxService(prisma as never);
    const result = await service.pollPending(7, 5);

    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: PvsSyncOutboxStatus.PENDING }),
        data: expect.objectContaining({ status: PvsSyncOutboxStatus.PROCESSING }),
      })
    );
    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0]?.attempts).toBe(1);
  });

  it("marks completed jobs with externalId", async () => {
    const findFirst = vi.fn().mockResolvedValue({
      id: "job-1",
      attempts: 1,
      nextRetryAt: now,
    });
    const update = vi.fn().mockResolvedValue({
      id: "job-1",
      status: PvsSyncOutboxStatus.COMPLETED,
      attempts: 1,
    });

    const prisma = { pvsSyncOutbox: { findFirst, update } };
    const service = new PvsOutboxService(prisma as never);

    const result = await service.acknowledgeCompleted(7, "job-1", "PVS-123");

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PvsSyncOutboxStatus.COMPLETED,
          externalId: "PVS-123",
        }),
      })
    );
    expect(result.status).toBe("COMPLETED");
  });

  it("schedules retry on failure before max attempts", async () => {
    const findFirst = vi.fn().mockResolvedValue({
      id: "job-1",
      attempts: 2,
      nextRetryAt: now,
    });
    const update = vi.fn().mockResolvedValue({
      id: "job-1",
      status: PvsSyncOutboxStatus.PENDING,
      attempts: 2,
      nextRetryAt: new Date("2026-07-04T12:10:00.000Z"),
    });

    const prisma = { pvsSyncOutbox: { findFirst, update } };
    const service = new PvsOutboxService(prisma as never);

    const result = await service.acknowledgeFailed(7, "job-1", "PVS timeout");

    expect(result.status).toBe("PENDING");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PvsSyncOutboxStatus.PENDING,
          lastError: "PVS timeout",
        }),
      })
    );
  });

  it("marks permanently failed after max attempts", async () => {
    const findFirst = vi.fn().mockResolvedValue({
      id: "job-1",
      attempts: PVS_OUTBOX_MAX_ATTEMPTS,
      nextRetryAt: now,
    });
    const update = vi.fn().mockResolvedValue({
      id: "job-1",
      status: PvsSyncOutboxStatus.FAILED,
      attempts: PVS_OUTBOX_MAX_ATTEMPTS,
      nextRetryAt: now,
    });

    const prisma = { pvsSyncOutbox: { findFirst, update } };
    const service = new PvsOutboxService(prisma as never);

    const result = await service.acknowledgeFailed(7, "job-1", "PVS down");

    expect(result.status).toBe("FAILED");
  });

  it("throws when acknowledging unknown job", async () => {
    const prisma = {
      pvsSyncOutbox: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    const service = new PvsOutboxService(prisma as never);

    await expect(service.acknowledgeCompleted(7, "missing", "PVS-1")).rejects.toBeInstanceOf(
      PvsOutboxNotFoundError
    );
  });
});
