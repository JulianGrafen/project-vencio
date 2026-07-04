import type { z } from "zod";

import { isDentalComplianceMode } from "./compliance-config";
import { INSURANCE_TYPE_OPTIONS } from "./medical-categories/constants";
import type { eventTypeBookingFields } from "@calcom/prisma/zod-utils";

type BookingField = z.infer<typeof eventTypeBookingFields>[number];

/** Identifier of the insurance booking field — shared with the pre-booking triage step. */
export const INSURANCE_BOOKING_FIELD_NAME = "insuranceType";

/** Standard patient intake fields for German dental practices. */
export const DENTAL_PATIENT_BOOKING_FIELDS: BookingField[] = [
  {
    name: INSURANCE_BOOKING_FIELD_NAME,
    type: "select",
    label: "Versicherungsart",
    editable: "system",
    required: true,
    options: INSURANCE_TYPE_OPTIONS.map(({ label, value }) => ({ label, value })),
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "dateOfBirth",
    type: "text",
    label: "Geburtsdatum",
    editable: "system",
    required: true,
    defaultPlaceholder: "TT.MM.JJJJ",
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "isNewPatient",
    type: "boolean",
    label: "Erstpatient?",
    editable: "system",
    required: true,
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
];

const DENTAL_HIDDEN_SYSTEM_FIELDS = new Set(["notes", "guests"]);

/**
 * Applies dental fork policies to booking fields:
 * - Injects Versicherungsart / Geburtsdatum / Erstpatient
 * - Hides free-text notes (Art. 9 DSGVO)
 */
export function applyDentalBookingFieldPolicy(bookingFields: BookingField[]): BookingField[] {
  if (!isDentalComplianceMode()) {
    return bookingFields;
  }

  const fields = bookingFields.map((field) => {
    if (DENTAL_HIDDEN_SYSTEM_FIELDS.has(field.name)) {
      return { ...field, hidden: true, required: false };
    }
    return field;
  });

  for (const dentalField of DENTAL_PATIENT_BOOKING_FIELDS) {
    const exists = fields.some((f) => f.name === dentalField.name);
    if (!exists) {
      // Insert after email field
      const emailIndex = fields.findIndex((f) => f.name === "email");
      const insertAt = emailIndex >= 0 ? emailIndex + 1 : fields.length;
      fields.splice(insertAt, 0, dentalField);
    }
  }

  return fields;
}
