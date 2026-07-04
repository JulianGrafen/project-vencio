/** Trial duration in days from {@link PracticeTrialFields.trialStartedAt}. */
export const PRACTICE_TRIAL_DURATION_DAYS = 30;

/** Maximum accepted bookings during the beta trial. */
export const PRACTICE_TRIAL_MAX_BOOKINGS = 10;

export const PRACTICE_TRIAL_ENV = {
  ENABLED: "PRACTICE_TRIAL_ENABLED",
  /** Stripe Payment Link or hosted checkout URL — primary upgrade CTA when set. */
  UPGRADE_CHECKOUT_URL: "PRACTICE_TRIAL_UPGRADE_CHECKOUT_URL",
  /** Mailto target when no checkout URL is configured. */
  UPGRADE_EMAIL: "PRACTICE_TRIAL_UPGRADE_EMAIL",
} as const;

export const PRACTICE_TRIAL_DEFAULT_UPGRADE_EMAIL = "hello@praxistermin.de";

/** Upgrade / pricing page path (conversion wall redirect target). */
export const PRACTICE_TRIAL_UPGRADE_PATH = "/upgrade";
