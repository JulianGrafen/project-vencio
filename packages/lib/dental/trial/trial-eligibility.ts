import dayjs from "@calcom/dayjs";

import {
  PRACTICE_TRIAL_DURATION_DAYS,
  PRACTICE_TRIAL_MAX_BOOKINGS,
} from "./trial.constants";

export type PracticeTrialFields = {
  trialStartedAt: Date | null;
  trialEndedAt: Date | null;
  isTrialActive: boolean;
  trialBookingsCount: number;
};

export type TrialExpiryReason = "inactive" | "time" | "bookings" | null;

export type TrialEligibilityResult = {
  /** User may access core product features. */
  eligible: boolean;
  isTrialActive: boolean;
  isExpired: boolean;
  reason: TrialExpiryReason;
  daysRemaining: number;
  bookingsRemaining: number;
  trialBookingsCount: number;
  trialEndsAt: Date | null;
};

function resolveTrialEndsAt(trialStartedAt: Date | null): Date | null {
  if (!trialStartedAt) {
    return null;
  }
  return dayjs(trialStartedAt).add(PRACTICE_TRIAL_DURATION_DAYS, "day").toDate();
}

function isTrialExpiredByTime(trialStartedAt: Date | null, referenceDate: Date): boolean {
  const trialEndsAt = resolveTrialEndsAt(trialStartedAt);
  if (!trialEndsAt) {
    return false;
  }
  return referenceDate.getTime() >= trialEndsAt.getTime();
}

function isTrialExpiredByBookings(trialBookingsCount: number): boolean {
  return trialBookingsCount >= PRACTICE_TRIAL_MAX_BOOKINGS;
}

export function isTrialExpired(
  trial: PracticeTrialFields,
  referenceDate: Date = new Date()
): boolean {
  if (!trial.isTrialActive) {
    return true;
  }

  if (trial.trialEndedAt && referenceDate.getTime() >= trial.trialEndedAt.getTime()) {
    return true;
  }

  return isTrialExpiredByTime(trial.trialStartedAt, referenceDate) || isTrialExpiredByBookings(trial.trialBookingsCount);
}

/** Full eligibility snapshot for guards, banners, and API responses. */
export function checkTrialEligibility(
  trial: PracticeTrialFields,
  referenceDate: Date = new Date()
): TrialEligibilityResult {
  const trialEndsAt = resolveTrialEndsAt(trial.trialStartedAt);
  const daysRemaining = trialEndsAt
    ? Math.max(0, dayjs(trialEndsAt).diff(dayjs(referenceDate), "day"))
    : PRACTICE_TRIAL_DURATION_DAYS;
  const bookingsRemaining = Math.max(0, PRACTICE_TRIAL_MAX_BOOKINGS - trial.trialBookingsCount);

  if (!trial.isTrialActive) {
    return {
      eligible: false,
      isTrialActive: false,
      isExpired: true,
      reason: "inactive",
      daysRemaining: 0,
      bookingsRemaining: 0,
      trialBookingsCount: trial.trialBookingsCount,
      trialEndsAt,
    };
  }

  if (trial.trialEndedAt && referenceDate.getTime() >= trial.trialEndedAt.getTime()) {
    return {
      eligible: false,
      isTrialActive: false,
      isExpired: true,
      reason: "inactive",
      daysRemaining: 0,
      bookingsRemaining: 0,
      trialBookingsCount: trial.trialBookingsCount,
      trialEndsAt,
    };
  }

  if (isTrialExpiredByBookings(trial.trialBookingsCount)) {
    return {
      eligible: false,
      isTrialActive: true,
      isExpired: true,
      reason: "bookings",
      daysRemaining,
      bookingsRemaining: 0,
      trialBookingsCount: trial.trialBookingsCount,
      trialEndsAt,
    };
  }

  if (isTrialExpiredByTime(trial.trialStartedAt, referenceDate)) {
    return {
      eligible: false,
      isTrialActive: true,
      isExpired: true,
      reason: "time",
      daysRemaining: 0,
      bookingsRemaining,
      trialBookingsCount: trial.trialBookingsCount,
      trialEndsAt,
    };
  }

  return {
    eligible: true,
    isTrialActive: true,
    isExpired: false,
    reason: null,
    daysRemaining,
    bookingsRemaining,
    trialBookingsCount: trial.trialBookingsCount,
    trialEndsAt,
  };
}

export const PRACTICE_TRIAL_SELECT = {
  trialStartedAt: true,
  trialEndedAt: true,
  isTrialActive: true,
  trialBookingsCount: true,
} as const;
