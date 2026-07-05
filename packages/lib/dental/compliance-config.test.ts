import { describe, expect, it, beforeEach, afterEach } from "vitest";

import {
  isDentalClientComplianceMode,
  isDentalComplianceMode,
  isDentalPracticeOnboardingEnabled,
  isDentalTrackingDisabled,
  sanitizeBookingTracking,
} from "./compliance-config";

describe("compliance-config", () => {
  const original = process.env.DENTAL_ENCRYPTION_ENABLED;
  const originalPublic = process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
  const originalAppName = process.env.NEXT_PUBLIC_APP_NAME;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = original;
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = originalPublic;
    process.env.NEXT_PUBLIC_APP_NAME = originalAppName;
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

  it("activates compliance mode when encryption is enabled with 1", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "1";
    expect(isDentalComplianceMode()).toBe(true);
  });

  it("activates client compliance mode via NEXT_PUBLIC flag", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "true";
    expect(isDentalClientComplianceMode()).toBe(true);
  });

  it("enables practice onboarding for teeth.al brand without compliance flag", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "false";
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
    process.env.NEXT_PUBLIC_APP_NAME = "teeth.al";
    expect(isDentalPracticeOnboardingEnabled()).toBe(true);
  });

  it("disables practice onboarding for non-dental app branding", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "false";
    process.env.NEXT_PUBLIC_APP_NAME = "Cal.diy";
    expect(isDentalPracticeOnboardingEnabled()).toBe(false);
  });
});
