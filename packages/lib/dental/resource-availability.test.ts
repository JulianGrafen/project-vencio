import { describe, expect, it } from "vitest";

import { filterAvailableSlotsByResourceBusyTimes } from "./resource-availability";

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
