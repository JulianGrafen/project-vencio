import { describe, expect, it } from "vitest";

import { findSmartFillCandidateSlots } from "./smart-fill-slot-scanner";

describe("findSmartFillCandidateSlots", () => {
  it("finds a 60-minute gap between two bookings on the same day", () => {
    const day = new Date("2026-07-10T00:00:00.000Z");
    const windowStart = new Date("2026-07-10T08:00:00.000Z");
    const windowEnd = new Date("2026-07-10T18:00:00.000Z");

    const slots = findSmartFillCandidateSlots({
      windowStart,
      windowEnd,
      minDurationMinutes: 30,
      timeZone: "UTC",
      availability: [{ dayOfWeek: 5, startMinutes: 9 * 60, endMinutes: 17 * 60 }],
      busyIntervals: [
        { start: new Date("2026-07-10T09:00:00.000Z"), end: new Date("2026-07-10T10:00:00.000Z") },
        { start: new Date("2026-07-10T11:00:00.000Z"), end: new Date("2026-07-10T12:00:00.000Z") },
      ],
    });

    const gap = slots.find(
      (s) => s.start.getTime() === new Date("2026-07-10T10:00:00.000Z").getTime()
    );

    expect(gap).toBeDefined();
    expect(gap?.end.getTime()).toBe(new Date("2026-07-10T11:00:00.000Z").getTime());
  });

  it("ignores gaps shorter than minimum duration", () => {
    const slots = findSmartFillCandidateSlots({
      windowStart: new Date("2026-07-10T08:00:00.000Z"),
      windowEnd: new Date("2026-07-10T18:00:00.000Z"),
      minDurationMinutes: 30,
      timeZone: "UTC",
      availability: [{ dayOfWeek: 5, startMinutes: 9 * 60, endMinutes: 17 * 60 }],
      busyIntervals: [
        { start: new Date("2026-07-10T09:00:00.000Z"), end: new Date("2026-07-10T09:15:00.000Z") },
        { start: new Date("2026-07-10T09:20:00.000Z"), end: new Date("2026-07-10T10:00:00.000Z") },
      ],
    });

    const shortGap = slots.find(
      (s) => s.start.getTime() === new Date("2026-07-10T09:15:00.000Z").getTime()
    );

    expect(shortGap).toBeUndefined();
  });
});
