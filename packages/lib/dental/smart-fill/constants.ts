/** Default minimum gap duration to qualify as Smart-Fill candidate. */
export const SMART_FILL_MIN_GAP_MINUTES = 30;

/** How far ahead to scan for empty slots (hours before appointment). */
export const SMART_FILL_LOOKAHEAD_HOURS = 48;

/** Cron interval recommendation (hours) — configured in vercel.json. */
export const SMART_FILL_CRON_INTERVAL_HOURS = 6;

/** Default estimated revenue per filled slot (cents) for dashboard KPI. */
export const SMART_FILL_DEFAULT_REVENUE_CENTS = 8000;

/** SMS keywords accepted as confirmation (case-insensitive). */
export const SMART_FILL_CONFIRM_KEYWORDS = ["JA", "J", "YES", "OK"] as const;

export const SMART_FILL_ENV = {
  ENABLED: "SMART_FILL_ENABLED",
  MOCK_SMS_LOG: "SMART_FILL_MOCK_SMS_LOG",
} as const;
