import type { DentalEventCategory } from "./event-type-categories";
import { buildDentalInPersonLocation } from "./booking-location-policy";

export type DentalDefaultEventTypeDefinition = {
  /** i18n key passed to t() */
  titleKey: string;
  slug: string;
  length: number;
  dentalCategory: DentalEventCategory;
  hidden?: boolean;
};

/**
 * Default Behandlungsarten for new dental practices (replaces Cal.com meeting templates).
 */
export const DENTAL_DEFAULT_EVENT_TYPES: DentalDefaultEventTypeDefinition[] = [
  {
    titleKey: "dental_event_kontrolle",
    slug: "kontrolle",
    length: 15,
    dentalCategory: "KONTROLLE",
  },
  {
    titleKey: "dental_event_pzr",
    slug: "pzr",
    length: 45,
    dentalCategory: "PROPHYLAXE",
  },
  {
    titleKey: "dental_event_schmerz",
    slug: "schmerz",
    length: 30,
    dentalCategory: "SCHMERZ",
  },
  {
    titleKey: "dental_event_behandlung",
    slug: "behandlung",
    length: 30,
    dentalCategory: "SONSTIGES",
  },
];

export function buildDentalEventTypeCreatePayload(
  definition: DentalDefaultEventTypeDefinition,
  title: string,
  practiceAddress?: string
) {
  return {
    title,
    slug: definition.slug,
    length: definition.length,
    hidden: definition.hidden ?? false,
    locations: [buildDentalInPersonLocation(practiceAddress)],
    metadata: {
      dentalCategory: definition.dentalCategory,
      hideDurationSelectorInBookingPage: true,
    },
  };
}
