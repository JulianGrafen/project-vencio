import type { DentalEventCategory } from "./event-type-categories";
import { DENTAL_EVENT_CATEGORY_ORDER, isDentalEventCategory } from "./event-type-categories";

export type DentalPublicEventType = {
  id: number;
  title: string;
  slug: string;
  length: number;
  descriptionAsSafeHTML?: string;
  metadata?: { dentalCategory?: string } | null;
};

export type GroupedDentalEventTypes = {
  category: DentalEventCategory;
  label: string;
  eventTypes: DentalPublicEventType[];
};

export function getDentalCategoryFromEventType(
  eventType: Pick<DentalPublicEventType, "metadata">
): DentalEventCategory {
  const raw = eventType.metadata?.dentalCategory;
  return isDentalEventCategory(raw) ? raw : "SONSTIGES";
}

export function groupEventTypesByDentalCategory(
  eventTypes: DentalPublicEventType[],
  getCategoryLabel: (category: DentalEventCategory) => string
): GroupedDentalEventTypes[] {
  const buckets = new Map<DentalEventCategory, DentalPublicEventType[]>();

  for (const category of DENTAL_EVENT_CATEGORY_ORDER) {
    buckets.set(category, []);
  }

  for (const eventType of eventTypes) {
    const category = getDentalCategoryFromEventType(eventType);
    buckets.get(category)?.push(eventType);
  }

  return DENTAL_EVENT_CATEGORY_ORDER.map((category) => ({
    category,
    label: getCategoryLabel(category),
    eventTypes: buckets.get(category) ?? [],
  })).filter((group) => group.eventTypes.length > 0);
}
