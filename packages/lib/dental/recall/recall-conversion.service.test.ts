import { describe, expect, it, vi } from "vitest";

import { RecallHistoryStatus } from "@calcom/prisma/enums";

import {
  appendRecallRefToBookingLink,
  extractRecallRefFromMetadata,
  RecallConversionService,
} from "./recall-conversion.service";

describe("appendRecallRefToBookingLink", () => {
  it("appends the ref as first query param", () => {
    expect(appendRecallRefToBookingLink("https://x.de/praxis/prophylaxe", "tok-1")).toBe(
      "https://x.de/praxis/prophylaxe?metadata[recallRef]=tok-1"
    );
  });

  it("appends with & when a query string exists", () => {
    expect(appendRecallRefToBookingLink("https://x.de/p?a=1", "tok-1")).toBe(
      "https://x.de/p?a=1&metadata[recallRef]=tok-1"
    );
  });

  it("url-encodes the token", () => {
    expect(appendRecallRefToBookingLink("https://x.de/p", "a b&c")).toContain("a%20b%26c");
  });
});

describe("extractRecallRefFromMetadata", () => {
  it("extracts the recall ref", () => {
    expect(extractRecallRefFromMetadata({ recallRef: "tok-1" })).toBe("tok-1");
  });

  it.each([null, undefined, "string", {}, { recallRef: "" }, { recallRef: 42 }])(
    "returns null for invalid metadata %p",
    (metadata) => {
      expect(extractRecallRefFromMetadata(metadata)).toBeNull();
    }
  );
});

describe("RecallConversionService", () => {
  it("attributes a booking to the sent recall exactly once", async () => {
    const prisma = {
      recallHistory: {
        updateMany: vi.fn(async () => ({ count: 1 })),
        count: vi.fn(),
      },
    };

    const service = new RecallConversionService(prisma as never);
    const attributed = await service.attributeBooking("tok-1", "booking-uid");

    expect(attributed).toBe(true);
    expect(prisma.recallHistory.updateMany).toHaveBeenCalledWith({
      where: {
        optOutToken: "tok-1",
        status: RecallHistoryStatus.SENT,
        convertedAt: null,
      },
      data: expect.objectContaining({ convertedBookingUid: "booking-uid" }),
    });
  });

  it("reports false when the recall was already converted or unknown", async () => {
    const prisma = {
      recallHistory: {
        updateMany: vi.fn(async () => ({ count: 0 })),
        count: vi.fn(),
      },
    };

    const service = new RecallConversionService(prisma as never);

    await expect(service.attributeBooking("unknown", "uid")).resolves.toBe(false);
  });

  it("aggregates monthly stats scoped to team and month", async () => {
    const prisma = {
      recallHistory: {
        updateMany: vi.fn(),
        count: vi
          .fn()
          .mockResolvedValueOnce(12)
          .mockResolvedValueOnce(4),
      },
    };

    const service = new RecallConversionService(prisma as never);
    const stats = await service.getMonthlyStats(7, new Date("2026-07-15T12:00:00Z"));

    expect(stats).toEqual({ sentThisMonth: 12, convertedThisMonth: 4 });
    const firstCallWhere = prisma.recallHistory.count.mock.calls[0][0].where;
    expect(firstCallWhere.teamId).toBe(7);
    expect(firstCallWhere.sentAt.gte.getMonth()).toBe(6);
  });
});
