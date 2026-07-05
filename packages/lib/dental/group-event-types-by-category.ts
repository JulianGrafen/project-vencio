import type { DentalEventCategory } from "./event-type-categories";
import { DENTAL_EVENT_CATEGORY_ORDER, isDentalEventCategory } from "./event-type-categories";

export type DentalPublicEventType = {
  id: number;
  title: string;
  slug: string;
  length: number;
  descriptionAsSafeHTML?: string | null;
  metadata?: unknown;
};

export type GroupedDentalEventTypes<T extends DentalPublicEventType = DentalPublicEventType> = {
  category: DentalEventCategory;
  label: string;
  eventTypes: T[];
};

export function getDentalCategoryFromEventType(
  eventType: Pick<DentalPublicEventType, "metadata">
): DentalEventCategory {
  const metadata = eventType.metadata as { dentalCategory?: string } | null | undefined;
  const raw = metadata?.dentalCategory;
  return isDentalEventCategory(raw) ? raw : "SONSTIGES";
}

export function groupEventTypesByDentalCategory<T extends DentalPublicEventType>(
  eventTypes: T[],
  getCategoryLabel: (category: DentalEventCategory) => string
): Array<{
  category: DentalEventCategory;
  label: string;
  eventTypes: T[];
}> {
  const buckets = new Map<DentalEventCategory, T[]>();

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
