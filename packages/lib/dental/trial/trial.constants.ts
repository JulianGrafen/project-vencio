/** Trial duration in days from {@link PracticeTrialFields.trialStartedAt}. */
export const PRACTICE_TRIAL_DURATION_DAYS = 30;

/** Maximum accepted bookings during the beta trial. */
export const PRACTICE_TRIAL_MAX_BOOKINGS = 10;

export const PRACTICE_TRIAL_ENV = {
  ENABLED: "PRACTICE_TRIAL_ENABLED",
} as const;

/** Upgrade / pricing page path (conversion wall redirect target). */
export const PRACTICE_TRIAL_UPGRADE_PATH = "/upgrade";
