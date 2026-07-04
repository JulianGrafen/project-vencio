import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { Select } from "@calcom/ui/components/form";

import {
  RESOURCE_TYPES,
  type ScheduleOption,
} from "./treatment-resources.constants";
import type { TreatmentResourcesSettingsState } from "./useTreatmentResourcesSettings";

type TreatmentResourceFormProps = {
  settings: TreatmentResourcesSettingsState;
};

export function TreatmentResourceForm({ settings }: TreatmentResourceFormProps) {
  return (
    <form
      className="space-y-4 rounded-lg border bg-subtle/30 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        settings.submitCreate();
      }}>
      <div>
        <h3 className="text-emphasis font-medium">Neue Ressource</h3>
        <p className="text-subtle text-sm">
          Der Slug wird in der Buchungs-URL verwendet (z. B. stuhl-1).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          value={settings.name}
          onChange={(event) => settings.setName(event.target.value)}
          required
        />
        <TextField
          label="Slug"
          value={settings.slug}
          onChange={(event) => settings.setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="resource-type">Typ</Label>
          <Select
            inputId="resource-type"
            options={RESOURCE_TYPES}
            value={RESOURCE_TYPES.find((option) => option.value === settings.type) ?? RESOURCE_TYPES[0]}
            onChange={(option) => settings.setType(option?.value ?? "CHAIR")}
          />
        </div>
        <div>
          <Label htmlFor="create-resource-schedule">Arbeitszeitplan (optional)</Label>
          <Select<ScheduleOption, false>
            inputId="create-resource-schedule"
            isDisabled={settings.schedulesLoading}
            isSearchable={false}
            options={settings.scheduleOptions}
            value={
              settings.scheduleOptions.find((option) => option.value === settings.createScheduleId) ??
              settings.scheduleOptions[0]
            }
            onChange={(option) => settings.setCreateScheduleId(option?.value ?? null)}
          />
        </div>
      </div>

      <Button type="submit" loading={settings.createMutation.isPending}>
        Ressource anlegen
      </Button>
    </form>
  );
}
