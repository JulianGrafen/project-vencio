import type { InsuranceType, MedicalCategory } from "@calcom/prisma/enums";

export type InsuranceTypeOption = {
  value: InsuranceType;
  label: string;
};

/**
 * Single source of truth for insurance type labels (patient-facing, German).
 * Consumed by the booking-field policy and the pre-booking triage step.
 */
export const INSURANCE_TYPE_OPTIONS: InsuranceTypeOption[] = [
  { value: "GESETZLICH", label: "Gesetzlich (Kasse)" },
  { value: "PRIVAT", label: "Privat" },
  { value: "SELBSTZAHLER", label: "Selbstzahler" },
];

export type MedicalCategoryDefinition = {
  category: MedicalCategory;
  /** Patient-facing label on the public booking page. */
  label: string;
  /** Short patient-facing description shown below the category heading. */
  description: string;
  /** Rendering order on the public booking page (ascending). */
  sortOrder: number;
};

/**
 * Fixed taxonomy of treatment categories. Order reflects patient intent:
 * acute pain first, routine prevention next, elective treatments last.
 */
export const MEDICAL_CATEGORY_DEFINITIONS: Record<MedicalCategory, MedicalCategoryDefinition> = {
  SCHMERZBEHANDLUNG: {
    category: "SCHMERZBEHANDLUNG",
    label: "Schmerzbehandlung",
    description: "Akute Beschwerden — schnellstmöglicher Termin",
    sortOrder: 0,
  },
  PROPHYLAXE: {
    category: "PROPHYLAXE",
    label: "Prophylaxe",
    description: "Professionelle Zahnreinigung und Vorsorge",
    sortOrder: 1,
  },
  KONTROLLE: {
    category: "KONTROLLE",
    label: "Kontrolle",
    description: "Regelmäßige Kontrolluntersuchung",
    sortOrder: 2,
  },
  FUELLUNG: {
    category: "FUELLUNG",
    label: "Füllungen",
    description: "Behandlung von Karies und Zahndefekten",
    sortOrder: 3,
  },
  IMPLANTOLOGIE: {
    category: "IMPLANTOLOGIE",
    label: "Implantologie",
    description: "Zahnersatz und implantologische Beratung",
    sortOrder: 4,
  },
  KIEFERORTHOPAEDIE: {
    category: "KIEFERORTHOPAEDIE",
    label: "Kieferorthopädie",
    description: "Zahn- und Kieferfehlstellungen",
    sortOrder: 5,
  },
  SONSTIGES: {
    category: "SONSTIGES",
    label: "Weitere Termine",
    description: "Alle weiteren Behandlungen",
    sortOrder: 6,
  },
};

export const DEFAULT_MEDICAL_CATEGORY: MedicalCategory = "SONSTIGES";

/** Query parameter carrying the triage selection into the booker (deep-linkable from recall emails). */
export const INSURANCE_QUERY_PARAM = "versicherung";
