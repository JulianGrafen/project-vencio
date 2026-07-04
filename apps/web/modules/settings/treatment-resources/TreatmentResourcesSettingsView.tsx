"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@calcom/ui/components/dialog";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Label, TextField } from "@calcom/ui/components/form";
import { Select } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useMemo, useState } from "react";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";

type ResourceTypeOption = { label: string; value: "CHAIR" | "ROOM" | "XRAY" };

const RESOURCE_TYPES: ResourceTypeOption[] = [
  { label: "Behandlungsstuhl", value: "CHAIR" },
  { label: "Behandlungsraum", value: "ROOM" },
  { label: "Röntgen", value: "XRAY" },
];

const RESOURCE_TYPE_LABELS: Record<ResourceTypeOption["value"], string> = {
  CHAIR: "Behandlungsstuhl",
  ROOM: "Behandlungsraum",
  XRAY: "Röntgen",
};

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
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);

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
      showToast("Ressource angelegt", "success");
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Anlegen fehlgeschlagen", "error"),
  });

  const deactivateMutation = trpc.viewer.treatmentResources.deactivate.useMutation({
    onSuccess: async () => {
      setDeactivateTarget(null);
      showToast("Ressource deaktiviert", "success");
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Deaktivieren fehlgeschlagen", "error"),
  });

  const assignScheduleMutation = trpc.viewer.treatmentResources.assignSchedule.useMutation({
    onSuccess: async () => {
      showToast("Zeitplan aktualisiert", "success");
      await utils.viewer.treatmentResources.list.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  if (!enabled) {
    return null;
  }

  const activeResources = resources ?? [];

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="treatment-resources"
      title="Behandlungsressourcen"
      description="Stühle, Räume und Geräte, die Patienten bei der Online-Buchung auswählen können.">
      <form
        className="space-y-4 rounded-lg border bg-subtle/30 p-4"
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
        <div>
          <h3 className="text-emphasis font-medium">Neue Ressource</h3>
          <p className="text-subtle text-sm">
            Der Slug wird in der Buchungs-URL verwendet (z. B. stuhl-1).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <TextField
            label="Slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <Button type="submit" loading={createMutation.isPending}>
          Ressource anlegen
        </Button>
      </form>

      <section className="space-y-3">
        <h3 className="text-emphasis font-medium">Aktive Ressourcen ({activeResources.length})</h3>

        {isLoading ? (
          <SkeletonText className="h-20 w-full" />
        ) : activeResources.length === 0 ? (
          <EmptyScreen
            Icon="layers"
            headline="Noch keine Ressourcen"
            description="Legen Sie Behandlungsstühle oder Räume an, damit Patienten den passenden Platz wählen können."
            className="py-10"
          />
        ) : (
          <ul className="divide-subtle divide-y rounded-lg border">
            {activeResources.map((resource) => {
              const selectedSchedule =
                scheduleOptions.find((option) => option.value === resource.scheduleId) ?? scheduleOptions[0];

              return (
                <li key={resource.id} className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-emphasis font-medium">{resource.name}</p>
                        <Badge variant="gray">{RESOURCE_TYPE_LABELS[resource.type as ResourceTypeOption["value"]] ?? resource.type}</Badge>
                      </div>
                      <p className="text-subtle font-mono text-xs">{resource.slug}</p>
                    </div>
                    <Button color="secondary" size="sm" onClick={() => setDeactivateTarget({ id: resource.id, name: resource.name })}>
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
        )}
      </section>

      <Dialog open={Boolean(deactivateTarget)} onOpenChange={(open) => !open && setDeactivateTarget(null)}>
        <DialogContent type="confirmation" title="Ressource deaktivieren?">
          <DialogHeader title="Ressource deaktivieren?" />
          <p className="text-subtle text-sm">
            {deactivateTarget?.name} wird für neue Buchungen ausgeblendet. Bestehende Termine bleiben
            unverändert.
          </p>
          <DialogFooter>
            <DialogClose color="secondary">Abbrechen</DialogClose>
            <Button
              color="destructive"
              loading={deactivateMutation.isPending}
              onClick={() => {
                if (!deactivateTarget) return;
                deactivateMutation.mutate({ teamId, resourceId: deactivateTarget.id });
              }}>
              Deaktivieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DentalSettingsShell>
  );
}
