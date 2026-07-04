"use client";

import { MEDICAL_TRUST_BRAND } from "@calcom/lib/dental/constants";
import { INSURANCE_TYPE_OPTIONS } from "@calcom/lib/dental/medical-categories/constants";
import type { InsuranceType } from "@calcom/prisma/enums";
import classNames from "classnames";

type InsuranceTriageProps = {
  selected: InsuranceType | null;
  onSelect: (insuranceType: InsuranceType) => void;
};

/**
 * Pre-booking triage: patients state their insurance type before any
 * treatment or date is shown. The selection filters restricted event types
 * and prefills the booking form.
 */
export function InsuranceTriage({ selected, onSelect }: InsuranceTriageProps) {
  return (
    <section aria-labelledby="insurance-triage-heading" className="mb-8" data-testid="insurance-triage">
      <h2
        id="insurance-triage-heading"
        className="mb-1 text-lg font-semibold"
        style={{ color: MEDICAL_TRUST_BRAND.primary }}>
        Wie sind Sie versichert?
      </h2>
      <p className="text-subtle mb-4 text-sm">
        Ihre Auswahl hilft uns, Ihnen die passenden Behandlungen anzuzeigen.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {INSURANCE_TYPE_OPTIONS.map(({ value, label }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              aria-pressed={isSelected}
              data-testid={`insurance-option-${value.toLowerCase()}`}
              className={classNames(
                "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                isSelected ? "text-white shadow-md" : "bg-default hover:shadow-sm"
              )}
              style={
                isSelected
                  ? { backgroundColor: MEDICAL_TRUST_BRAND.primary, borderColor: MEDICAL_TRUST_BRAND.primary }
                  : { borderColor: `${MEDICAL_TRUST_BRAND.primary}33`, color: MEDICAL_TRUST_BRAND.primary }
              }>
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
