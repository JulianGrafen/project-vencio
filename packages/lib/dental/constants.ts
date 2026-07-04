import { BookingStatus } from "@calcom/prisma/enums";

/** PraxisTermin / teeth.al brand accent — Medical Trust palette primary. */
export const DENTAL_BRAND_TEAL = "#0F4C81";

/** Medical Trust palette tokens for teeth.al UI (Phase 2 theming). */
export const MEDICAL_TRUST_COLORS = {
  primary: "#0F4C81",
  background: "#F8FAFC",
  success: "#059669",
} as const;

export const DEFAULT_EVENT_DURATION_MINUTES = 30;

/** Booking statuses that block calendar/resource slots from being re-booked. */
export const DENTAL_BLOCKING_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.ACCEPTED,
  BookingStatus.PENDING,
  BookingStatus.AWAITING_HOST,
];

export const TREATMENT_RESOURCE_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  type: true,
  scheduleId: true,
} as const;

export const TREATMENT_RESOURCE_ADMIN_LIST_SELECT = {
  ...TREATMENT_RESOURCE_LIST_SELECT,
  isActive: true,
} as const;
