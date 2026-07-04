import type { z } from "zod";

import { isDentalClientComplianceMode, isDentalComplianceMode } from "./compliance-config";
import type { eventTypeBookingFields } from "@calcom/prisma/zod-utils";

type BookingField = z.infer<typeof eventTypeBookingFields>[number];

const GERMAN_MONTHS = [
  { label: "Januar", value: "01" },
  { label: "Februar", value: "02" },
  { label: "März", value: "03" },
  { label: "April", value: "04" },
  { label: "Mai", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Dezember", value: "12" },
] as const;

function createBirthDayOptions(): { label: string; value: string }[] {
  return Array.from({ length: 31 }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return { label: day, value: day };
  });
}

function createBirthYearOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];
  for (let year = currentYear - 1; year >= currentYear - 120; year--) {
    years.push({ label: String(year), value: String(year) });
  }
  return years;
}

/** Whether dental patient intake fields should be applied (server or client compliance). */
export function isDentalBookingFormActive(): boolean {
  return isDentalComplianceMode() || isDentalClientComplianceMode();
}

/** Standard patient intake fields for German dental practices — dropdowns only, no freetext. */
export const DENTAL_PATIENT_BOOKING_FIELDS: BookingField[] = [
  {
    name: "insuranceType",
    type: "select",
    label: "Versicherungsart",
    editable: "system",
    required: true,
    options: [
      { label: "Gesetzlich (Kasse)", value: "GESETZLICH" },
      { label: "Privat", value: "PRIVAT" },
      { label: "Selbstzahler", value: "SELBSTZAHLER" },
    ],
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "birthDay",
    type: "select",
    label: "Geburtstag",
    editable: "system",
    required: true,
    options: createBirthDayOptions(),
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "birthMonth",
    type: "select",
    label: "Geburtsmonat",
    editable: "system",
    required: true,
    options: [...GERMAN_MONTHS],
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "birthYear",
    type: "select",
    label: "Geburtsjahr",
    editable: "system",
    required: true,
    options: createBirthYearOptions(),
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
  {
    name: "isNewPatient",
    type: "select",
    label: "Patientenstatus",
    editable: "system",
    required: true,
    options: [
      { label: "Erstpatient", value: "FIRST" },
      { label: "Bestandspatient", value: "RETURNING" },
    ],
    sources: [{ label: "Dental", id: "dental", type: "system" }],
  },
];

const DENTAL_HIDDEN_SYSTEM_FIELDS = new Set(["notes", "guests", "title"]);
const DENTAL_DISALLOWED_FREETEXT_TYPES = new Set(["text", "textarea"]);

/**
 * Applies dental fork policies to booking fields:
 * - Injects Versicherungsart / Geburtsdatum / Patientenstatus as dropdowns
 * - Hides free-text notes and custom text fields (Art. 9 DSGVO)
 */
export function applyDentalBookingFieldPolicy(bookingFields: BookingField[]): BookingField[] {
  if (!isDentalBookingFormActive()) {
    return bookingFields;
  }

  const fields = bookingFields
    .filter((field) => field.name !== "dateOfBirth")
    .map((field) => {
      if (DENTAL_HIDDEN_SYSTEM_FIELDS.has(field.name)) {
        return { ...field, hidden: true, required: false };
      }

      if (
        DENTAL_DISALLOWED_FREETEXT_TYPES.has(field.type) &&
        field.editable === "user" &&
        field.name !== "rescheduleReason"
      ) {
        return { ...field, hidden: true, required: false };
      }

      return field;
    });

  for (const dentalField of DENTAL_PATIENT_BOOKING_FIELDS) {
    const existingIndex = fields.findIndex((f) => f.name === dentalField.name);
    if (existingIndex === -1) {
      const emailIndex = fields.findIndex((f) => f.name === "email");
      const insertAt = emailIndex >= 0 ? emailIndex + 1 : fields.length;
      fields.splice(insertAt, 0, dentalField);
      continue;
    }

    fields[existingIndex] = {
      ...dentalField,
      ...fields[existingIndex],
      hidden: false,
      options: dentalField.options,
      type: dentalField.type,
      required: dentalField.required,
    };
  }

  return fields;
}
