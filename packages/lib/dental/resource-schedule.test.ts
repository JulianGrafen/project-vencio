import { describe, expect, it } from "vitest";

import {
  filterAvailableSlotsByResourceSchedule,
  isSlotWithinResourceSchedule,
  type ResourceScheduleContext,
} from "./resource-schedule";

describe("resource-schedule", () => {
  const mondayNineToFive: ResourceScheduleContext = {
    timeZone: "Europe/Berlin",
    availability: [
      {
        days: [1],
        startTime: new Date(Date.UTC(1970, 0, 1, 8, 0)),
        endTime: new Date(Date.UTC(1970, 0, 1, 17, 0)),
        date: null,
      },
    ],
  };

  it("allows slots inside working hours", () => {
    // 2026-07-06 is a Monday
    expect(
      isSlotWithinResourceSchedule("2026-07-06T08:00:00.000Z", 30, mondayNineToFive)
    ).toBe(true);
  });

  it("rejects slots outside working hours", () => {
    expect(
      isSlotWithinResourceSchedule("2026-07-06T04:00:00.000Z", 30, mondayNineToFive)
    ).toBe(false);
  });

  it("allows all slots when no schedule is configured", () => {
    expect(isSlotWithinResourceSchedule("2026-07-06T08:00:00.000Z", 30, null)).toBe(true);
  });

  it("filterAvailableSlotsByResourceSchedule removes out-of-schedule slots", () => {
    const schedule = {
      slots: {
        "2026-07-06": [
          { time: "2026-07-06T08:00:00.000Z" },
          { time: "2026-07-06T04:00:00.000Z" },
        ],
      },
    };

    const filtered = filterAvailableSlotsByResourceSchedule(schedule, mondayNineToFive, 30);
    expect(filtered.slots["2026-07-06"]).toHaveLength(1);
    expect(filtered.slots["2026-07-06"][0].time).toBe("2026-07-06T08:00:00.000Z");
  });
});
