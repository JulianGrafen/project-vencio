import { describe, expect, it, beforeEach, afterEach } from "vitest";

import {
  prepareAttendeeEmailBlindIndexFilter,
  resolveTeamIdsForAttendeeEmailFilter,
  shouldUseAttendeeEmailBlindIndexFilter,
} from "./attendee-blind-index-filter";

describe("attendee-blind-index-filter", () => {
  const original = process.env.DENTAL_ENCRYPTION_ENABLED;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = original;
  });

  describe("resolveTeamIdsForAttendeeEmailFilter", () => {
    it("prefers explicit filter teamIds", () => {
      expect(resolveTeamIdsForAttendeeEmailFilter([1, 2], [99])).toEqual([1, 2]);
    });

    it("falls back to permission teamIds", () => {
      expect(resolveTeamIdsForAttendeeEmailFilter(undefined, [42])).toEqual([42]);
    });

    it("returns empty when neither source has teams", () => {
      expect(resolveTeamIdsForAttendeeEmailFilter(undefined, [])).toEqual([]);
    });
  });

  describe("shouldUseAttendeeEmailBlindIndexFilter", () => {
    beforeEach(() => {
      process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    });

    it("returns true for non-empty email when compliance is on", () => {
      expect(shouldUseAttendeeEmailBlindIndexFilter("patient@example.com")).toBe(true);
    });

    it("returns false when compliance is off", () => {
      process.env.DENTAL_ENCRYPTION_ENABLED = "false";
      expect(shouldUseAttendeeEmailBlindIndexFilter("patient@example.com")).toBe(false);
    });
  });

  describe("prepareAttendeeEmailBlindIndexFilter", () => {
    it("returns null when encryption is disabled", async () => {
      process.env.DENTAL_ENCRYPTION_ENABLED = "false";

      const result = await prepareAttendeeEmailBlindIndexFilter({
        prisma: {} as never,
        attendeeEmail: "patient@example.com",
        filterTeamIds: [1],
        permissionTeamIds: [],
      });

      expect(result).toBeNull();
    });
  });
});
