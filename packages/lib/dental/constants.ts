import { BookingStatus } from "@calcom/prisma/enums";

/** PraxisTermin / teeth.al brand accent — re-export Medical Trust primary. */
export { MEDICAL_TRUST_COLORS, MEDICAL_TRUST_COLORS as DENTAL_BRAND_COLORS } from "./theme/medical-trust-colors";

/** @deprecated Use MEDICAL_TRUST_COLORS.primary */
export const DENTAL_BRAND_TEAL = "#0F4C81";

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
