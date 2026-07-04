"use client";

import type { DentalPublicEventType } from "@calcom/lib/dental/group-event-types-by-category";
import {
  getDentalCategoryFromEventType,
  groupEventTypesByDentalCategory,
} from "@calcom/lib/dental/group-event-types-by-category";
import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { DENTAL_EVENT_CATEGORY_LABELS } from "@calcom/lib/dental/event-type-categories";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Icon } from "@calcom/ui/components/icon";
import { EventTypeDescriptionLazy as EventTypeDescription } from "@calcom/web/modules/event-types/components";
import Link from "next/link";
import type { CSSProperties } from "react";

type DentalEventTypeGridProps = {
  username: string;
  eventTypes: DentalPublicEventType[];
  query: Record<string, string | string[] | undefined>;
  listItemStyles?: CSSProperties;
};

export function DentalEventTypeGrid({
  username,
  eventTypes,
  query,
  listItemStyles,
}: DentalEventTypeGridProps) {
  const { t } = useLocale();

  if (!isDentalClientComplianceMode()) {
    return null;
  }

  const groups = groupEventTypesByDentalCategory(eventTypes, (category) =>
    t(`dental_category_${category.toLowerCase()}`, DENTAL_EVENT_CATEGORY_LABELS[category])
  );

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8" data-testid="dental-event-type-grid">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="text-emphasis mb-3 text-sm font-semibold uppercase tracking-wide">
            {group.label}
          </h2>
          <div className="border-subtle grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
            {group.eventTypes.map((type) => (
              <Link
                key={type.id}
                style={listItemStyles}
                prefetch={false}
                href={{
                  pathname: `/${username}/${type.slug}`,
                  query,
                }}
                className="bg-default hover:bg-cal-muted group relative rounded-lg border border-subtle p-4 transition"
                data-testid="dental-event-type-card">
                <Icon
                  name="arrow-right"
                  className="text-emphasis absolute right-3 top-3 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                />
                <p className="text-default pr-6 text-sm font-semibold">{type.title}</p>
                <p className="text-subtle mt-1 text-xs">
                  {t(`dental_category_${getDentalCategoryFromEventType(type).toLowerCase()}`, group.label)}
                </p>
                <EventTypeDescription eventType={type} isPublic shortenedDescription />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
