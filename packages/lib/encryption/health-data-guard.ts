import { HEALTH_DATA_GUARD_FIELDS } from "./field-registry";

/**
 * German medical keywords indicating Art. 9 GDPR health data in free-text fields.
 * Used to block patient-entered diagnoses/symptoms in booking flows.
 */
export const HEALTH_DATA_KEYWORDS_DE = [
  "schmerz",
  "schmerzen",
  "zahnschmerz",
  "kopfschmerz",
  "diagnose",
  "befund",
  "symptom",
  "symptome",
  "krankheit",
  "erkrankung",
  "allergie",
  "allergisch",
  "medikament",
  "medikation",
  "antibiotik",
  "blutung",
  "blutet",
  "entzündung",
  "entzuendung",
  "infektion",
  "karies",
  "parodont",
  "parodontose",
  "wurzel",
  "wurzelbehandlung",
  "implantat",
  "prothese",
  "zahnfleisch",
  "abszess",
  "eiter",
  "röntgen",
  "roentgen",
  "ct-scan",
  "mrt",
  "tumor",
  "krebs",
  "diabetes",
  "herzinfarkt",
  "schlaganfall",
  "schwangerschaft",
  "schwanger",
  "depression",
  "angst",
  "panik",
  "psych",
  "therapie",
  "behandlung wegen",
  "operation",
  "op ",
  "narkose",
  "sedierung",
  "impfung",
  "impf",
  "covid",
  "corona",
  "hepatitis",
  "hiv",
  "aids",
] as const;

export class HealthDataGuardError extends Error {
  readonly code = "HEALTH_DATA_NOT_ALLOWED";

  constructor(message: string) {
    super(message);
    this.name = "HealthDataGuardError";
  }
}

function normalizeForScan(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function findHealthDataKeywords(text: string): string[] {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalized = normalizeForScan(text);
  return HEALTH_DATA_KEYWORDS_DE.filter((keyword) => normalized.includes(keyword));
}

export function assertNoHealthDataInText(fieldName: string, text: string): void {
  const matches = findHealthDataKeywords(text);
  if (matches.length > 0) {
    throw new HealthDataGuardError(
      `Gesundheitsbezogene Angaben sind im Feld "${fieldName}" nicht erlaubt. ` +
        `Bitte beschreiben Sie Ihr Anliegen telefonisch oder wählen Sie eine passende Behandlungsart.`
    );
  }
}

function scanUnknownValue(fieldName: string, value: unknown): void {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value === "string") {
    assertNoHealthDataInText(fieldName, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanUnknownValue(`${fieldName}[${index}]`, entry));
    return;
  }

  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      scanUnknownValue(`${fieldName}.${key}`, nested);
    }
  }
}

export function assertNoHealthDataInRecord(
  record: Record<string, unknown>,
  allowedFreeTextFields: Set<string> = HEALTH_DATA_GUARD_FIELDS
): void {
  for (const [field, value] of Object.entries(record)) {
    if (!allowedFreeTextFields.has(field)) {
      continue;
    }
    scanUnknownValue(field, value);
  }
}

export function assertNoHealthDataInBookingResponses(responses: Record<string, unknown>): void {
  const blockedPatientFields = new Set(["notes", "description", "additionalInfo", "message", "comment"]);
  for (const [field, value] of Object.entries(responses)) {
    if (blockedPatientFields.has(field) || field.toLowerCase().includes("note")) {
      scanUnknownValue(`responses.${field}`, value);
    }
  }
}
