import { describe, expect, it, beforeEach, afterEach } from "vitest";

import {
  isDentalComplianceMode,
  isDentalTrackingDisabled,
  sanitizeBookingTracking,
} from "./compliance-config";

describe("compliance-config", () => {
  const original = process.env.DENTAL_ENCRYPTION_ENABLED;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = original;
  });

  beforeEach(() => {
    delete process.env.DENTAL_DISABLE_TRACKING;
  });

  it("activates compliance mode when encryption is enabled", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    expect(isDentalComplianceMode()).toBe(true);
    expect(isDentalTrackingDisabled()).toBe(true);
  });

  it("strips tracking payloads in dental mode", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    expect(sanitizeBookingTracking({ utm_source: "google" })).toBeUndefined();
  });

  it("preserves tracking when compliance mode is off", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "false";
    const tracking = { utm_source: "google" };
    expect(sanitizeBookingTracking(tracking)).toEqual(tracking);
  });
});
