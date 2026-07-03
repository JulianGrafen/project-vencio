import { describe, expect, it, vi } from "vitest";

import { DEFAULT_EVENT_DURATION_MINUTES } from "./constants";
import { filterAvailableSlotsByResourceBusyTimes, resolveEventTypeDurationMinutes } from "./resource-availability";

vi.mock("@calcom/prisma", () => ({
  prisma: {
    eventType: {
      findUnique: vi.fn(),
    },
    bookingResource: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@calcom/prisma";

describe("filterAvailableSlotsByResourceBusyTimes", () => {
  it("removes slots overlapping resource busy intervals", () => {
    const schedule = {
      slots: {
        "2026-07-10": [
          { time: "2026-07-10T09:00:00.000Z" },
          { time: "2026-07-10T10:00:00.000Z" },
          { time: "2026-07-10T11:00:00.000Z" },
        ],
      },
    };

    const filtered = filterAvailableSlotsByResourceBusyTimes(
      schedule,
      [{ start: new Date("2026-07-10T09:30:00.000Z"), end: new Date("2026-07-10T10:30:00.000Z") }],
      30
    );

    expect(filtered.slots["2026-07-10"].map((slot) => slot.time)).toEqual([
      "2026-07-10T09:00:00.000Z",
      "2026-07-10T11:00:00.000Z",
    ]);
  });

  it("returns schedule unchanged when no busy intervals exist", () => {
    const schedule = {
      slots: {
        "2026-07-10": [{ time: "2026-07-10T09:00:00.000Z" }],
      },
    };

    expect(filterAvailableSlotsByResourceBusyTimes(schedule, [], 30)).toEqual(schedule);
  });
});

describe("resolveEventTypeDurationMinutes", () => {
  it("returns event type length when available", async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue({ length: 60 } as never);
    await expect(resolveEventTypeDurationMinutes(1)).resolves.toBe(60);
  });

  it("falls back to default duration when event type is missing", async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(null);
    await expect(resolveEventTypeDurationMinutes(999)).resolves.toBe(DEFAULT_EVENT_DURATION_MINUTES);
  });
});
