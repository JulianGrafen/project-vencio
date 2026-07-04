"use client";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import {
  DENTAL_EVENT_CATEGORIES,
  DENTAL_EVENT_CATEGORY_LABELS,
  type DentalEventCategory,
} from "@calcom/lib/dental/event-type-categories";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Label, Select } from "@calcom/ui/components/form";
import { useFormContext } from "react-hook-form";

type DentalCategoryFieldProps = {
  disabled?: boolean;
};

export function DentalCategoryField({ disabled }: DentalCategoryFieldProps) {
  const { t } = useLocale();
  const formMethods = useFormContext<{ metadata?: { dentalCategory?: DentalEventCategory } }>();
  const value = formMethods.watch("metadata.dentalCategory") ?? "SONSTIGES";

  if (!isDentalComplianceMode()) {
    return null;
  }

  const options = DENTAL_EVENT_CATEGORIES.map((category) => ({
    value: category,
    label: t(`dental_category_${category.toLowerCase()}`, DENTAL_EVENT_CATEGORY_LABELS[category]),
  }));

  return (
    <div className="mt-4">
      <Label htmlFor="dental-category">Behandlungskategorie</Label>
      <Select
        inputId="dental-category"
        isDisabled={disabled}
        options={options}
        value={options.find((option) => option.value === value) ?? options[0]}
        onChange={(option) => {
          if (!option) return;
          formMethods.setValue("metadata.dentalCategory", option.value, { shouldDirty: true });
        }}
      />
      <p className="text-subtle mt-1 text-xs">
        Steuert die Gruppierung auf der öffentlichen Buchungsseite (Prophylaxe, Schmerz, Kontrolle).
      </p>
    </div>
  );
}
