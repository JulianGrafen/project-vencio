import { afterEach, describe, expect, it } from "vitest";

import {
  checkTrialEligibility,
  isTrialExpired,
} from "./trial-eligibility";
import { PRACTICE_TRIAL_DURATION_DAYS, PRACTICE_TRIAL_MAX_BOOKINGS } from "./trial.constants";

const startedAt = new Date("2026-06-01T00:00:00Z");

describe("trial-eligibility", () => {
  afterEach(() => {
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
  });

  it("isTrialExpired returns false during active trial window", () => {
    const reference = new Date("2026-06-15T00:00:00Z");
    expect(
      isTrialExpired(
        {
          trialStartedAt: startedAt,
          trialEndedAt: null,
          isTrialActive: true,
          trialBookingsCount: 3,
        },
        reference
      )
    ).toBe(false);
  });

  it("isTrialExpired returns true after 30 days", () => {
    const reference = new Date("2026-07-02T00:00:00Z");
    expect(
      isTrialExpired(
        {
          trialStartedAt: startedAt,
          trialEndedAt: null,
          isTrialActive: true,
          trialBookingsCount: 0,
        },
        reference
      )
    ).toBe(true);
  });

  it("isTrialExpired returns true at booking limit", () => {
    expect(
      isTrialExpired({
        trialStartedAt: startedAt,
        trialEndedAt: null,
        isTrialActive: true,
        trialBookingsCount: PRACTICE_TRIAL_MAX_BOOKINGS,
      })
    ).toBe(true);
  });

  it("checkTrialEligibility reports days and bookings remaining", () => {
    const reference = new Date("2026-06-11T00:00:00Z");
    const result = checkTrialEligibility(
      {
        trialStartedAt: startedAt,
        trialEndedAt: null,
        isTrialActive: true,
        trialBookingsCount: 2,
      },
      reference
    );

    expect(result.eligible).toBe(true);
    expect(result.daysRemaining).toBe(PRACTICE_TRIAL_DURATION_DAYS - 10);
    expect(result.bookingsRemaining).toBe(PRACTICE_TRIAL_MAX_BOOKINGS - 2);
  });

  it("checkTrialEligibility marks booking limit expiry", () => {
    const result = checkTrialEligibility({
      trialStartedAt: startedAt,
      trialEndedAt: null,
      isTrialActive: true,
      trialBookingsCount: PRACTICE_TRIAL_MAX_BOOKINGS,
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("bookings");
  });
});
