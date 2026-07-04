import type { InsuranceType, MedicalCategory } from "@calcom/prisma/enums";

import {
  DEFAULT_MEDICAL_CATEGORY,
  MEDICAL_CATEGORY_DEFINITIONS,
  type MedicalCategoryDefinition,
} from "./constants";
import { ZInsuranceType } from "./schemas";

export type MedicalProfileSummary = {
  category: MedicalCategory;
  allowedInsuranceTypes: InsuranceType[];
  displayOrder: number;
  isEmergency: boolean;
};

type WithOptionalMedicalProfile = {
  medicalProfile?: MedicalProfileSummary | null;
};

export type MedicalCategoryGroup<TEventType> = {
  definition: MedicalCategoryDefinition;
  eventTypes: TEventType[];
};

/**
 * Parses an untrusted value (query param, form input) into an InsuranceType.
 * Returns null instead of throwing — callers decide whether absence is an error.
 */
export function parseInsuranceType(value: unknown): InsuranceType | null {
  const result = ZInsuranceType.safeParse(value);
  return result.success ? result.data : null;
}

/**
 * An empty allow-list means "bookable by everyone" — practices only restrict
 * explicitly (e.g. private-only treatments).
 */
export function isInsuranceAllowed(
  allowedInsuranceTypes: InsuranceType[],
  insuranceType: InsuranceType
): boolean {
  if (allowedInsuranceTypes.length === 0) return true;
  return allowedInsuranceTypes.includes(insuranceType);
}

function resolveCategory(profile: MedicalProfileSummary | null | undefined): MedicalCategory {
  return profile?.category ?? DEFAULT_MEDICAL_CATEGORY;
}

/**
 * Groups event types into the fixed category taxonomy for the public booking page.
 * - Emergency categories/entries surface first (patient in pain scans top-down).
 * - Within a group, event types keep their practice-defined displayOrder.
 * - Empty groups are omitted.
 */
export function groupEventTypesByCategory<TEventType extends WithOptionalMedicalProfile>(
  eventTypes: TEventType[],
  insuranceType?: InsuranceType | null
): MedicalCategoryGroup<TEventType>[] {
  const visibleEventTypes = insuranceType
    ? eventTypes.filter((eventType) =>
        isInsuranceAllowed(eventType.medicalProfile?.allowedInsuranceTypes ?? [], insuranceType)
      )
    : eventTypes;

  const groups = new Map<MedicalCategory, TEventType[]>();
  for (const eventType of visibleEventTypes) {
    const category = resolveCategory(eventType.medicalProfile);
    const group = groups.get(category);
    if (group) {
      group.push(eventType);
    } else {
      groups.set(category, [eventType]);
    }
  }

  return Array.from(groups.entries())
    .map(([category, groupedEventTypes]) => ({
      definition: MEDICAL_CATEGORY_DEFINITIONS[category],
      eventTypes: [...groupedEventTypes].sort(byEmergencyThenDisplayOrder),
    }))
    .sort((a, b) => a.definition.sortOrder - b.definition.sortOrder);
}

function byEmergencyThenDisplayOrder(a: WithOptionalMedicalProfile, b: WithOptionalMedicalProfile): number {
  const emergencyDelta = Number(b.medicalProfile?.isEmergency ?? false) - Number(a.medicalProfile?.isEmergency ?? false);
  if (emergencyDelta !== 0) return emergencyDelta;
  return (a.medicalProfile?.displayOrder ?? 0) - (b.medicalProfile?.displayOrder ?? 0);
}
