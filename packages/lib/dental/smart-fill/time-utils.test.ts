import { describe, expect, it } from "vitest";

import { timeToMinutesUtc } from "./time-utils";

describe("timeToMinutesUtc", () => {
  it("reads UTC hours and minutes from Prisma Time values", () => {
    const nineAm = new Date("1970-01-01T09:30:00.000Z");
    expect(timeToMinutesUtc(nineAm)).toBe(9 * 60 + 30);
  });
});
