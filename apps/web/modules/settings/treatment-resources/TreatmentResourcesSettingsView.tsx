"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { Select } from "@calcom/ui/components/form";
import { useMemo, useState } from "react";

import { DentalSettingsCrossLinks } from "~/settings/dental/DentalSettingsCrossLinks";

type ResourceTypeOption = { label: string; value: "CHAIR" | "ROOM" | "XRAY" };

const RESOURCE_TYPES: ResourceTypeOption[] = [
  { label: "Behandlungsstuhl", value: "CHAIR" },
  { label: "Behandlungsraum", value: "ROOM" },
  { label: "Röntgen", value: "XRAY" },
];

type ScheduleOption = { label: string; value: number | null };

type TreatmentResourcesSettingsViewProps = {
  teamId: number;
};

function formatScheduleLabel(schedule: { name: string; timeZone: string | null }) {
  return schedule.timeZone ? `${schedule.name} (${schedule.timeZone})` : schedule.name;
}

export function TreatmentResourcesSettingsView({ teamId }: TreatmentResourcesSettingsViewProps) {
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<ResourceTypeOption["value"]>("CHAIR");
  const [createScheduleId, setCreateScheduleId] = useState<number | null>(null);

  const enabled = isDentalClientComplianceMode() && teamId > 0;

  const { data: resources, isLoading } = trpc.viewer.treatmentResources.list.useQuery(
    { teamId },
    { enabled }
  );

  const { data: schedules, isLoading: schedulesLoading } =
    trpc.viewer.treatmentResources.listTeamSchedules.useQuery({ teamId }, { enabled });

  const scheduleOptions = useMemo<ScheduleOption[]>(() => {
    const teamSchedules =
      schedules?.map((schedule) => ({
        label: formatScheduleLabel(schedule),
        value: schedule.id,
      })) ?? [];

    return [{ label: "Kein eigener Zeitplan", value: null }, ...teamSchedules];
  }, [schedules]);

  const createMutation = trpc.viewer.treatmentResources.create.useMutation({
    onSuccess: async () => {
      setName("");
      setSlug("");
      setCreateScheduleId(null);
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
  });

  const deactivateMutation = trpc.viewer.treatmentResources.deactivate.useMutation({
    onSuccess: async () => {
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
  });

  const assignScheduleMutation = trpc.viewer.treatmentResources.assignSchedule.useMutation({
    onSuccess: async () => {
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
  });

  if (!enabled) {
    return null;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-emphasis text-lg font-semibold">Behandlungsressourcen</h2>
        <p className="text-subtle text-sm">
          Stühle, Räume und Geräte, die parallel zum Behandler gebucht werden müssen. Optional kann pro
          Ressource ein eigener Arbeitszeitplan hinterlegt werden.
        </p>
      </div>

      <ul className="divide-subtle divide-y rounded-md border">
        {isLoading && <li className="text-subtle p-4 text-sm">Laden…</li>}
        {!isLoading && resources?.length === 0 && (
          <li className="text-subtle p-4 text-sm">Noch keine Ressourcen angelegt.</li>
        )}
        {resources?.map((resource) => {
          const selectedSchedule =
            scheduleOptions.find((option) => option.value === resource.scheduleId) ?? scheduleOptions[0];

          return (
            <li key={resource.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-emphasis font-medium">{resource.name}</p>
                  <p className="text-subtle text-xs">
                    {resource.slug} · {resource.type}
                  </p>
                </div>
                <Button
                  color="secondary"
                  onClick={() => deactivateMutation.mutate({ teamId, resourceId: resource.id })}>
                  Deaktivieren
                </Button>
              </div>

              <div>
                <Label htmlFor={`resource-schedule-${resource.id}`}>Arbeitszeitplan</Label>
                <Select<ScheduleOption, false>
                  inputId={`resource-schedule-${resource.id}`}
                  isDisabled={schedulesLoading || assignScheduleMutation.isPending}
                  isSearchable={false}
                  options={scheduleOptions}
                  value={selectedSchedule}
                  onChange={(option) => {
                    if (!option) return;
                    assignScheduleMutation.mutate({
                      teamId,
                      resourceId: resource.id,
                      scheduleId: option.value,
                    });
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <form
        className="space-y-4 rounded-md border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || !slug.trim()) return;
          createMutation.mutate({
            teamId,
            name: name.trim(),
            slug: slug.trim(),
            type,
            ...(createScheduleId !== null ? { scheduleId: createScheduleId } : {}),
          });
        }}>
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        <TextField
          label="Slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))}
          required
        />
        <div>
          <Label htmlFor="resource-type">Typ</Label>
          <Select<ResourceTypeOption, false>
            inputId="resource-type"
            options={RESOURCE_TYPES}
            value={RESOURCE_TYPES.find((option) => option.value === type) ?? RESOURCE_TYPES[0]}
            onChange={(option) => setType(option?.value ?? "CHAIR")}
          />
        </div>
        <div>
          <Label htmlFor="create-resource-schedule">Arbeitszeitplan (optional)</Label>
          <Select<ScheduleOption, false>
            inputId="create-resource-schedule"
            isDisabled={schedulesLoading}
            isSearchable={false}
            options={scheduleOptions}
            value={scheduleOptions.find((option) => option.value === createScheduleId) ?? scheduleOptions[0]}
            onChange={(option) => setCreateScheduleId(option?.value ?? null)}
          />
        </div>
        <Button type="submit" loading={createMutation.isPending}>
          Ressource anlegen
        </Button>
      </form>

      <DentalSettingsCrossLinks teamId={teamId} current="treatment-resources" />
    </div>
  );
}
