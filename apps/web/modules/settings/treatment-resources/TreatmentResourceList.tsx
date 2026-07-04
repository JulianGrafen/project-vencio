import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Label } from "@calcom/ui/components/form";
import { Select } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import {
  RESOURCE_TYPE_LABELS,
  type ResourceTypeOption,
  type ScheduleOption,
} from "./treatment-resources.constants";
import type { TreatmentResourcesSettingsState } from "./useTreatmentResourcesSettings";

type TreatmentResourceListProps = {
  teamId: number;
  settings: TreatmentResourcesSettingsState;
};

export function TreatmentResourceList({ teamId, settings }: TreatmentResourceListProps) {
  const activeResources = settings.resources ?? [];

  return (
    <section className="space-y-3">
      <h3 className="text-emphasis font-medium">Aktive Ressourcen ({activeResources.length})</h3>

      {settings.isLoading ? (
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
              settings.scheduleOptions.find((option) => option.value === resource.scheduleId) ??
              settings.scheduleOptions[0];

            return (
              <li key={resource.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-emphasis font-medium">{resource.name}</p>
                      <Badge variant="gray">
                        {RESOURCE_TYPE_LABELS[resource.type as ResourceTypeOption["value"]] ?? resource.type}
                      </Badge>
                    </div>
                    <p className="text-subtle font-mono text-xs">{resource.slug}</p>
                  </div>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => settings.setDeactivateTarget({ id: resource.id, name: resource.name })}>
                    Deaktivieren
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`resource-schedule-${resource.id}`}>Arbeitszeitplan</Label>
                  <Select<ScheduleOption, false>
                    inputId={`resource-schedule-${resource.id}`}
                    isDisabled={settings.schedulesLoading || settings.assignScheduleMutation.isPending}
                    isSearchable={false}
                    options={settings.scheduleOptions}
                    value={selectedSchedule}
                    onChange={(option) => {
                      if (!option) return;
                      settings.assignScheduleMutation.mutate({
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
  );
}
