"use client";

import { useBookerStore } from "@calcom/features/bookings/Booker/store";
import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Label, Select } from "@calcom/ui/components/form";

type ResourceOption = {
  label: string;
  value: string;
};

type TreatmentResourceSelectorProps = {
  eventTypeId?: number | null;
};

export function TreatmentResourceSelector({ eventTypeId }: TreatmentResourceSelectorProps) {
  const selectedTreatmentResourceId = useBookerStore((state) => state.selectedTreatmentResourceId);
  const setSelectedTreatmentResourceId = useBookerStore((state) => state.setSelectedTreatmentResourceId);

  const enabled = isDentalClientComplianceMode() && Boolean(eventTypeId);

  const { data: resources, isLoading } = trpc.viewer.treatmentResources.listForEventType.useQuery(
    { eventTypeId: eventTypeId ?? 0 },
    { enabled }
  );

  if (!enabled || (!isLoading && (!resources || resources.length === 0))) {
    return null;
  }

  const options: ResourceOption[] =
    resources?.map((resource) => ({
      label: resource.name,
      value: resource.id,
    })) ?? [];

  const selectedOption =
    options.find((option) => option.value === selectedTreatmentResourceId) ?? null;

  return (
    <div className="mb-4">
      <Label htmlFor="treatment-resource">Behandlungsstuhl / Raum</Label>
      <Select<ResourceOption, false>
        inputId="treatment-resource"
        isLoading={isLoading}
        placeholder="Bitte wählen…"
        options={options}
        value={selectedOption}
        onChange={(option: ResourceOption | null) => {
          setSelectedTreatmentResourceId(option?.value ?? null);
        }}
      />
    </div>
  );
}
