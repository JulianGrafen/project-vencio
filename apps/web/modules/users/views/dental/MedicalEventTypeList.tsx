"use client";

import { MEDICAL_TRUST_BRAND } from "@calcom/lib/dental/constants";
import { INSURANCE_BOOKING_FIELD_NAME } from "@calcom/lib/dental/medical-categories/constants";
import { groupEventTypesByCategory } from "@calcom/lib/dental/medical-categories/medical-categories";
import type { InsuranceType, MedicalCategory } from "@calcom/prisma/enums";
import { Icon } from "@calcom/ui/components/icon";
import Link from "next/link";

import { MEDICAL_CATEGORY_ICONS } from "./medical-category-icons";

export type MedicalEventTypeItem = {
  id: number;
  slug: string;
  title: string;
  descriptionAsSafeHTML?: string | null;
  length: number;
  medicalProfile?: {
    category: MedicalCategory;
    allowedInsuranceTypes: InsuranceType[];
    displayOrder: number;
    isEmergency: boolean;
  } | null;
};

type MedicalEventTypeListProps = {
  username: string;
  eventTypes: MedicalEventTypeItem[];
  insuranceType: InsuranceType | null;
  /** Extra query params to forward into the booker (e.g. embed context). */
  query: Record<string, string | string[] | undefined>;
};

/**
 * Public booking page list, grouped by treatment category. Pain treatment is
 * always pinned first; event types excluded for the selected insurance type
 * are hidden entirely.
 */
export function MedicalEventTypeList({
  username,
  eventTypes,
  insuranceType,
  query,
}: MedicalEventTypeListProps) {
  const groups = groupEventTypesByCategory(eventTypes, insuranceType);

  if (groups.length === 0) {
    return (
      <p className="text-subtle py-8 text-center text-sm" data-testid="no-medical-event-types">
        Für Ihre Auswahl sind aktuell keine Online-Termine verfügbar. Bitte rufen Sie uns an.
      </p>
    );
  }

  return (
    <div className="space-y-8" data-testid="medical-event-types">
      {groups.map(({ definition, eventTypes: groupedEventTypes }) => (
        <section key={definition.category} aria-label={definition.label}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: MEDICAL_TRUST_BRAND.primary }}>
              <Icon name={MEDICAL_CATEGORY_ICONS[definition.category]} className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold" style={{ color: MEDICAL_TRUST_BRAND.primary }}>
                {definition.label}
              </h2>
              <p className="text-subtle text-xs">{definition.description}</p>
            </div>
          </div>
          <div className="border-subtle bg-default overflow-hidden rounded-xl border">
            {groupedEventTypes.map((eventType) => (
              <Link
                key={eventType.id}
                prefetch={false}
                href={{
                  pathname: `/${username}/${eventType.slug}`,
                  query: {
                    ...query,
                    ...(insuranceType ? { [INSURANCE_BOOKING_FIELD_NAME]: insuranceType } : {}),
                  },
                }}
                data-testid="medical-event-type-link"
                className="hover:bg-cal-muted group relative block border-b p-5 transition last:border-b-0">
                <Icon
                  name="arrow-right"
                  className="absolute right-4 top-5 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-default text-sm font-semibold">{eventType.title}</h3>
                  <span className="text-subtle text-xs">{eventType.length} Min.</span>
                </div>
                {eventType.descriptionAsSafeHTML && (
                  <div
                    className="text-subtle mt-1 line-clamp-2 text-sm"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized via markdownToSafeHTML server-side
                    dangerouslySetInnerHTML={{ __html: eventType.descriptionAsSafeHTML }}
                  />
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
