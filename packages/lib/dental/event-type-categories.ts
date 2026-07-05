export const DENTAL_EVENT_CATEGORIES = ["PROPHYLAXE", "SCHMERZ", "KONTROLLE", "SONSTIGES"] as const;

export type DentalEventCategory = (typeof DENTAL_EVENT_CATEGORIES)[number];

export const DENTAL_EVENT_CATEGORY_LABELS: Record<DentalEventCategory, string> = {
  PROPHYLAXE: "Prophylaxe",
  SCHMERZ: "Schmerz & Akut",
  KONTROLLE: "Kontrolle",
  SONSTIGES: "Sonstige Behandlungen",
};

export const DENTAL_EVENT_CATEGORY_ORDER: DentalEventCategory[] = [
  "KONTROLLE",
  "PROPHYLAXE",
  "SCHMERZ",
  "SONSTIGES",
];

export function isDentalEventCategory(value: unknown): value is DentalEventCategory {
  return typeof value === "string" && DENTAL_EVENT_CATEGORIES.includes(value as DentalEventCategory);
}

export function getDentalEventCategoryLabel(category: DentalEventCategory): string {
  return DENTAL_EVENT_CATEGORY_LABELS[category];
}
