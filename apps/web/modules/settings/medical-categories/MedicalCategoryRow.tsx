"use client";

import {
  INSURANCE_TYPE_OPTIONS,
  MEDICAL_CATEGORY_DEFINITIONS,
  DEFAULT_MEDICAL_CATEGORY,
} from "@calcom/lib/dental/medical-categories/constants";
import type { InsuranceType, MedicalCategory } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { Label, Select, SettingsToggle } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

import { DentalCard, DentalHelpText } from "~/settings/dental/dental-ui";

type CategoryOption = { label: string; value: MedicalCategory };

const CATEGORY_OPTIONS: CategoryOption[] = Object.values(MEDICAL_CATEGORY_DEFINITIONS)
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(({ category, label }) => ({ value: category, label }));

const ALL_INSURANCE_TYPES = INSURANCE_TYPE_OPTIONS.map(({ value }) => value);

export type MedicalProfileEventType = {
  id: number;
  title: string;
  slug: string;
  hidden: boolean;
  medicalProfile: {
    category: MedicalCategory;
    allowedInsuranceTypes: InsuranceType[];
    isEmergency: boolean;
  } | null;
};

type MedicalCategoryRowProps = {
  teamId: number;
  eventType: MedicalProfileEventType;
};

/** Empty allow-list in the DB means "all insurance types" — mirror that in the UI. */
function toSelectedInsurances(allowed: InsuranceType[]): InsuranceType[] {
  return allowed.length === 0 ? ALL_INSURANCE_TYPES : allowed;
}

function toAllowedInsurances(selected: InsuranceType[]): InsuranceType[] {
  return selected.length === ALL_INSURANCE_TYPES.length ? [] : selected;
}

export function MedicalCategoryRow({ teamId, eventType }: MedicalCategoryRowProps) {
  const utils = trpc.useUtils();
  const [category, setCategory] = useState<MedicalCategory>(
    eventType.medicalProfile?.category ?? DEFAULT_MEDICAL_CATEGORY
  );
  const [selectedInsurances, setSelectedInsurances] = useState<InsuranceType[]>(() =>
    toSelectedInsurances(eventType.medicalProfile?.allowedInsuranceTypes ?? [])
  );
  const [isEmergency, setIsEmergency] = useState(eventType.medicalProfile?.isEmergency ?? false);

  const upsertMutation = trpc.viewer.medicalProfiles.upsert.useMutation({
    onSuccess: async () => {
      showToast("Kategorie gespeichert", "success");
      await utils.viewer.medicalProfiles.list.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  const toggleInsurance = (insurance: InsuranceType) => {
    setSelectedInsurances((current) =>
      current.includes(insurance)
        ? current.filter((value) => value !== insurance)
        : [...current, insurance]
    );
  };

  return (
    <DentalCard>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-emphasis text-sm font-semibold">{eventType.title}</h4>
          <p className="text-subtle text-xs">
            /{eventType.slug}
            {eventType.hidden ? " · ausgeblendet" : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label htmlFor={`category-${eventType.id}`}>Medizinische Kategorie</Label>
          <Select<CategoryOption>
            inputId={`category-${eventType.id}`}
            options={CATEGORY_OPTIONS}
            value={CATEGORY_OPTIONS.find((option) => option.value === category)}
            onChange={(option) => option && setCategory(option.value)}
          />
        </div>

        <div>
          <Label>Buchbar für</Label>
          <div className="flex flex-wrap gap-2">
            {INSURANCE_TYPE_OPTIONS.map(({ value, label }) => {
              const isSelected = selectedInsurances.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleInsurance(value)}
                  className={classNames(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    isSelected
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-subtle text-subtle hover:border-emphasis"
                  )}>
                  {label}
                </button>
              );
            })}
          </div>
          <DentalHelpText>Alle ausgewählt = keine Einschränkung</DentalHelpText>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <SettingsToggle
          title="Notfall / Schmerzpatient"
          description="Wird auf der Buchungsseite immer ganz oben angezeigt"
          checked={isEmergency}
          onCheckedChange={setIsEmergency}
        />

        <Button
          size="sm"
          loading={upsertMutation.isPending}
          disabled={selectedInsurances.length === 0}
          onClick={() =>
            upsertMutation.mutate({
              teamId,
              eventTypeId: eventType.id,
              category,
              allowedInsuranceTypes: toAllowedInsurances(selectedInsurances),
              isEmergency,
            })
          }>
          Speichern
        </Button>
      </div>
    </DentalCard>
  );
}
