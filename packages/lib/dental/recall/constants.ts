/** Default recall interval for prophylaxis (months). */
export const RECALL_DEFAULT_INTERVAL_MONTHS = 6;

/** Days after exact due date that daily cron still sends (missed exact day). */
export const RECALL_DEFAULT_TOLERANCE_DAYS = 3;

/** How many days ahead to show pending recalls in the dashboard API. */
export const RECALL_PENDING_LOOKAHEAD_DAYS = 7;

export const RECALL_ENV = {
  ENABLED: "RECALL_ENABLED",
  EMAIL_PROVIDER: "RECALL_EMAIL_PROVIDER",
  /** When true, production validation requires Twilio credentials for optional SMS recalls. */
  SMS_ENABLED: "RECALL_SMS_ENABLED",
} as const;

export const RECALL_TEMPLATE_VARIABLES = {
  PATIENT_NAME: "[PatientenName]",
  BOOKING_LINK: "[TerminLink]",
  PRACTICE_NAME: "[PraxisName]",
  OPT_OUT_LINK: "[OptOutLink]",
} as const;

export type RecallTemplateContext = {
  patientName: string;
  bookingLink: string;
  practiceName: string;
  optOutLink: string;
};
