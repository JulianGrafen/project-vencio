"use client";

import { useBookerStoreContext } from "@calcom/features/bookings/Booker/BookerStoreProvider";
import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import classNames from "@calcom/ui/classNames";

export const INSURANCE_TYPE_OPTIONS = [
  { value: "GESETZLICH", label: "Kassenpatient" },
  { value: "PRIVAT", label: "Privatpatient" },
  { value: "SELBSTZAHLER", label: "Selbstzahler" },
] as const;

export type InsuranceTypeValue = (typeof INSURANCE_TYPE_OPTIONS)[number]["value"];

type InsuranceTypeStepProps = {
  className?: string;
};

export function InsuranceTypeStep({ className }: InsuranceTypeStepProps) {
  const [selectedInsuranceType, setSelectedInsuranceType] = useBookerStoreContext((state) => [
    state.selectedInsuranceType,
    state.setSelectedInsuranceType,
  ]);

  if (!isDentalClientComplianceMode()) {
    return null;
  }

  return (
    <div className={classNames("mb-4", className)} data-testid="insurance-type-step">
      <p className="text-emphasis mb-1 text-sm font-semibold">Versicherungsart</p>
      <p className="text-subtle mb-3 text-xs">Wichtig für die Abrechnung in Ihrer Praxis.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {INSURANCE_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedInsuranceType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              data-testid={`insurance-type-${option.value.toLowerCase()}`}
              onClick={() => setSelectedInsuranceType(option.value)}
              className={classNames(
                "rounded-lg border px-3 py-3 text-left text-sm transition",
                isSelected
                  ? "border-[#0F4C81] bg-[#E8F1F8] font-medium text-[#0F4C81] shadow-sm"
                  : "border-subtle bg-default text-default hover:border-[#0F4C81]/40"
              )}>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
