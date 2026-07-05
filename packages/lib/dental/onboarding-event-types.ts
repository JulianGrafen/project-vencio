import { isDentalClientComplianceMode } from "./compliance-config";
import {
  buildDentalEventTypeCreatePayload,
  DENTAL_DEFAULT_EVENT_TYPES,
} from "./default-event-types";

export type OnboardingEventTypeCreateInput = {
  title: string;
  slug: string;
  length: number;
  hidden?: boolean;
  locations?: { type: string; address?: string }[];
  metadata?: Record<string, unknown>;
};

const LEGACY_ONBOARDING_EVENT_TYPE_KEYS = [
  { titleKey: "15min_meeting", slug: "15min", length: 15 },
  { titleKey: "30min_meeting", slug: "30min", length: 30 },
  { titleKey: "secret_meeting", slug: "secret", length: 15, hidden: true },
] as const;

/**
 * Event types created during onboarding — dental Behandlungsarten in compliance mode,
 * legacy Cal.com meeting templates otherwise.
 */
export function getOnboardingEventTypeCreates(
  translate: (key: string) => string,
  options?: { practiceAddress?: string }
): OnboardingEventTypeCreateInput[] {
  if (isDentalClientComplianceMode()) {
    return DENTAL_DEFAULT_EVENT_TYPES.map((definition) =>
      buildDentalEventTypeCreatePayload(
        definition,
        translate(definition.titleKey),
        options?.practiceAddress
      )
    );
  }

  return LEGACY_ONBOARDING_EVENT_TYPE_KEYS.map((event) => ({
    title: translate(event.titleKey),
    slug: event.slug,
    length: event.length,
    hidden: "hidden" in event ? event.hidden : undefined,
  }));
}
