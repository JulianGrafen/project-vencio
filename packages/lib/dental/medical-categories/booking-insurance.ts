import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import type { InsuranceType } from "@calcom/prisma/enums";

import { INSURANCE_BOOKING_FIELD_NAME } from "../booking-fields";
import { isInsuranceAllowed, parseInsuranceType } from "./medical-categories";

type InsuranceProfileStore = {
  eventTypeMedicalProfile: {
    findUnique(args: {
      where: { eventTypeId: number };
      select: { allowedInsuranceTypes: true };
    }): Promise<{ allowedInsuranceTypes: InsuranceType[] } | null>;
  };
};

/**
 * Reads the triage selection out of untrusted booking responses.
 * Returns null when absent or malformed — the booking-field schema owns
 * required-ness, this only feeds the dedicated aggregation column.
 */
export function extractInsuranceTypeFromResponses(responses: unknown): InsuranceType | null {
  if (typeof responses !== "object" || responses === null) {
    return null;
  }

  const value = (responses as Record<string, unknown>)[INSURANCE_BOOKING_FIELD_NAME];
  return parseInsuranceType(value);
}

/**
 * Rejects bookings whose insurance type the practice excluded for this event
 * type (e.g. private-only treatments). Event types without a medical profile
 * accept every insurance type.
 */
export async function assertInsuranceAllowedForEventType(
  db: InsuranceProfileStore,
  eventTypeId: number,
  insuranceType: InsuranceType
): Promise<void> {
  const profile = await db.eventTypeMedicalProfile.findUnique({
    where: { eventTypeId },
    select: { allowedInsuranceTypes: true },
  });

  if (!profile) {
    return;
  }

  if (!isInsuranceAllowed(profile.allowedInsuranceTypes, insuranceType)) {
    throw new ErrorWithCode(
      ErrorCode.BadRequest,
      `Insurance type ${insuranceType} is not bookable for event type ${eventTypeId}`
    );
  }
}
