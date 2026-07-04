import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import { DENTAL_BLOCKING_BOOKING_STATUSES } from "../constants";

/** Default minimum gap duration to qualify as Smart-Fill candidate. */
export const SMART_FILL_MIN_GAP_MINUTES = 30;

/** How far ahead to scan for empty slots (hours before appointment). */
export const SMART_FILL_LOOKAHEAD_HOURS = 48;

/** Cron interval recommendation (hours) — configured in vercel.json. */
export const SMART_FILL_CRON_INTERVAL_HOURS = 6;

/** Default estimated revenue per filled slot (cents) for dashboard KPI. */
export const SMART_FILL_DEFAULT_REVENUE_CENTS = 8000;

/** Default Mon–Fri 09:00–17:00 when no schedule exists. */
export const SMART_FILL_DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5] as const;
export const SMART_FILL_DEFAULT_WORK_START_MINUTES = 9 * 60;
export const SMART_FILL_DEFAULT_WORK_END_MINUTES = 17 * 60;

export const SMART_FILL_DEFAULT_TREATMENT_TITLE = "Behandlung";
export const SMART_FILL_DEFAULT_BOOKING_TITLE = "Smart-Fill Termin";

export const SMART_FILL_BOOKING_SOURCE = "smart-fill";
export const SMART_FILL_HOLD_SOURCE = "smart-fill-hold";

/** SMS keywords accepted as confirmation (exact match, case-insensitive). */
export const SMART_FILL_CONFIRM_KEYWORDS = ["JA", "YES", "OK", "JAWOHL"] as const;

/** SMS keywords accepted as decline (exact match, case-insensitive). */
export const SMART_FILL_DECLINE_KEYWORDS = ["NEIN", "N", "NO"] as const;

export const SMART_FILL_STALE_TASK_STATUSES = [
  SmartFillTaskStatus.PENDING,
  SmartFillTaskStatus.INVITED,
] as const;

export const SMART_FILL_BUSY_BOOKING_STATUSES = DENTAL_BLOCKING_BOOKING_STATUSES;

export const SMART_FILL_ENV = {
  ENABLED: "SMART_FILL_ENABLED",
  EMAIL_PROVIDER: "SMART_FILL_EMAIL_PROVIDER",
  MOCK_EMAIL_LOG: "SMART_FILL_MOCK_EMAIL_LOG",
  /** @deprecated SMS invites disabled — use email only */
  MOCK_SMS_LOG: "SMART_FILL_MOCK_SMS_LOG",
} as const;

export function isSmartFillConfirmKeyword(body: string): boolean {
  const normalized = body.trim().toUpperCase();
  return SMART_FILL_CONFIRM_KEYWORDS.includes(normalized as (typeof SMART_FILL_CONFIRM_KEYWORDS)[number]);
}

export function isSmartFillDeclineKeyword(body: string): boolean {
  const normalized = body.trim().toUpperCase();
  return SMART_FILL_DECLINE_KEYWORDS.includes(normalized as (typeof SMART_FILL_DECLINE_KEYWORDS)[number]);
}
