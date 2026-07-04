import { describe, expect, it, vi } from "vitest";

import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

import { RecallHistoryService } from "./recall-history.service";

describe("RecallHistoryService", () => {
  it("detects active recall for patient and due date", async () => {
    const prisma = {
      recallHistory: {
        findFirst: vi.fn(async () => ({ id: "hist-1" })),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const service = new RecallHistoryService(prisma as never);
    const hasActive = await service.hasActiveRecall({
      patientId: "pat-1",
      recallDueDate: new Date("2026-07-04"),
      channel: RecallChannel.EMAIL,
    });

    expect(hasActive).toBe(true);
    expect(prisma.recallHistory.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: "pat-1",
          channel: RecallChannel.EMAIL,
          status: { in: [RecallHistoryStatus.SENT, RecallHistoryStatus.PENDING] },
        }),
      })
    );
  });

  it("creates pending history and returns id", async () => {
    const prisma = {
      recallHistory: {
        findFirst: vi.fn(),
        create: vi.fn(async () => ({ id: "new-hist" })),
        update: vi.fn(),
      },
    };

    const service = new RecallHistoryService(prisma as never);
    const id = await service.createPending({
      teamId: 1,
      patientId: "pat-1",
      channel: RecallChannel.EMAIL,
      recallDueDate: new Date("2026-07-04"),
      optOutToken: "token",
    });

    expect(id).toBe("new-hist");
  });
});
