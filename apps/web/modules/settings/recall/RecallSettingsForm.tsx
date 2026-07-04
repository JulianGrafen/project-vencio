import {
  RECALL_DEFAULT_INTERVAL_MONTHS,
  RECALL_DEFAULT_TOLERANCE_DAYS,
  RECALL_PENDING_LOOKAHEAD_DAYS,
} from "@calcom/lib/dental/recall/constants";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

import { DentalCard, DentalHelpText, DentalSectionHeader } from "~/settings/dental/dental-ui";

type RecallSettingsFormProps = {
  teamId: number;
  settings: {
    enabled: boolean;
    intervalMonths: number;
    toleranceDays: number;
    smsEnabled: boolean;
  };
  isLoading: boolean;
};

export function RecallSettingsForm({ teamId, settings, isLoading }: RecallSettingsFormProps) {
  const utils = trpc.useUtils();
  const [intervalMonths, setIntervalMonths] = useState("");
  const [toleranceDays, setToleranceDays] = useState("");

  const updateMutation = trpc.viewer.recall.updateSettings.useMutation({
    onSuccess: async () => {
      showToast("Recall-Einstellungen gespeichert", "success");
      await utils.viewer.recall.getSettings.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonText className="h-10 w-full" />
        <SkeletonText className="h-10 w-full" />
      </div>
    );
  }

  const intervalValue = intervalMonths || String(settings.intervalMonths ?? RECALL_DEFAULT_INTERVAL_MONTHS);
  const toleranceValue =
    toleranceDays || String(settings.toleranceDays ?? RECALL_DEFAULT_TOLERANCE_DAYS);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        updateMutation.mutate({
          teamId,
          enabled: settings.enabled,
          intervalMonths: Number(intervalValue),
          toleranceDays: Number(toleranceValue),
          smsEnabled: settings.smsEnabled,
        });
      }}>
      <SettingsToggle
        title="Recall aktiv"
        description="Täglicher Versand an fällige Patienten aus dem Smart-Fill-Pool"
        checked={settings.enabled}
        onCheckedChange={(checked) => updateMutation.mutate({ teamId, enabled: checked })}
      />

      <div>
        <Label htmlFor="recall-interval">Intervall (Monate)</Label>
        <TextField
          id="recall-interval"
          type="number"
          min={1}
          max={24}
          value={intervalValue}
          onChange={(event) => setIntervalMonths(event.target.value)}
        />
        <DentalHelpText>Standard: {RECALL_DEFAULT_INTERVAL_MONTHS} Monate nach letztem Besuch</DentalHelpText>
      </div>

      <div>
        <Label htmlFor="recall-tolerance">Toleranzfenster (Tage)</Label>
        <TextField
          id="recall-tolerance"
          type="number"
          min={0}
          max={14}
          value={toleranceValue}
          onChange={(event) => setToleranceDays(event.target.value)}
        />
        <DentalHelpText>Erinnerung nur innerhalb dieses Fensters nach Fälligkeit</DentalHelpText>
      </div>

      <SettingsToggle
        title="SMS zusätzlich zur E-Mail"
        description="Kurze SMS-Erinnerung, wenn Telefonnummer hinterlegt ist"
        checked={settings.smsEnabled}
        onCheckedChange={(checked) => updateMutation.mutate({ teamId, smsEnabled: checked })}
      />

      <Button type="submit" loading={updateMutation.isPending}>
        Intervall speichern
      </Button>
    </form>
  );
}
