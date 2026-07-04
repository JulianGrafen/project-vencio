import { trpc } from "@calcom/trpc/react";
import { showToast } from "@calcom/ui/components/toast";
import { useMemo, useState } from "react";

import {
  formatScheduleLabel,
  type ResourceTypeOption,
  type ScheduleOption,
} from "./treatment-resources.constants";

export function useTreatmentResourcesSettings(teamId: number, enabled: boolean) {
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<ResourceTypeOption["value"]>("CHAIR");
  const [createScheduleId, setCreateScheduleId] = useState<number | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);

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

  const submitCreate = () => {
    if (!name.trim() || !slug.trim()) return;
    createMutation.mutate({
      teamId,
      name: name.trim(),
      slug: slug.trim(),
      type,
      ...(createScheduleId !== null ? { scheduleId: createScheduleId } : {}),
    });
  };

  return {
    resources,
    isLoading,
    schedulesLoading,
    scheduleOptions,
    name,
    setName,
    slug,
    setSlug,
    type,
    setType,
    createScheduleId,
    setCreateScheduleId,
    deactivateTarget,
    setDeactivateTarget,
    createMutation,
    deactivateMutation,
    assignScheduleMutation,
    submitCreate,
  };
}

export type TreatmentResourcesSettingsState = ReturnType<typeof useTreatmentResourcesSettings>;
