"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { trpc } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Label, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";

type RecallSettingsViewProps = {
  teamId: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function RecallSettingsView({ teamId }: RecallSettingsViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0 && isRecallEnabled();

  const { data: settings, isLoading: settingsLoading } = trpc.viewer.recall.getSettings.useQuery(
    { teamId },
    { enabled }
  );

  const { data: pending, isLoading: pendingLoading } = trpc.viewer.recall.pending.useQuery(
    { teamId },
    { enabled }
  );

  const { data: history, isLoading: historyLoading } = trpc.viewer.recall.history.useQuery(
    { teamId, limit: 20 },
    { enabled }
  );

  const [intervalMonths, setIntervalMonths] = useState<string>("");
  const [toleranceDays, setToleranceDays] = useState<string>("");

  const updateMutation = trpc.viewer.recall.updateSettings.useMutation({
    onSuccess: async () => {
      showToast("Recall-Einstellungen gespeichert", "success");
      await utils.viewer.recall.getSettings.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => {
      showToast(error.message || "Speichern fehlgeschlagen", "error");
    },
  });

  if (!isDentalClientComplianceMode() || teamId <= 0) {
    return null;
  }

  if (!isRecallEnabled()) {
    return (
      <DentalSettingsShell
        teamId={teamId}
        activeTab="recall"
        title="Recall"
        description="Automatische Prophylaxe-Erinnerungen per E-Mail und SMS.">
        <EmptyScreen
          Icon="mail"
          headline="Recall ist deaktiviert"
          description="Aktivieren Sie RECALL_ENABLED in der Umgebungskonfiguration, um Erinnerungen zu versenden."
        />
      </DentalSettingsShell>
    );
  }

  const intervalValue = intervalMonths || String(settings?.intervalMonths ?? 6);
  const toleranceValue = toleranceDays || String(settings?.toleranceDays ?? 3);

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="recall"
      title="Recall"
      description="Automatische Prophylaxe-Erinnerungen — konfigurieren Sie Intervall, Kanäle und sehen Sie anstehende Erinnerungen.">
      <div className="grid gap-8 lg:grid-cols-5">
        <section className="space-y-4 lg:col-span-2">
          <h3 className="text-emphasis font-medium">Einstellungen</h3>
          {settingsLoading || !settings ? (
            <div className="space-y-3">
              <SkeletonText className="h-10 w-full" />
              <SkeletonText className="h-10 w-full" />
            </div>
          ) : (
            <form
              className="space-y-4 rounded-lg border p-4"
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
                onCheckedChange={(checked) =>
                  updateMutation.mutate({ teamId, enabled: checked })
                }
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
                <p className="text-subtle mt-1 text-xs">Standard: 6 Monate nach letztem Besuch</p>
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
                <p className="text-subtle mt-1 text-xs">Erinnerung nur innerhalb dieses Fensters nach Fälligkeit</p>
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
          )}
        </section>

        <section className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-emphasis font-medium">Anstehende Erinnerungen (7 Tage)</h3>
            {!pendingLoading && pending?.enabled ? (
              <Badge variant="gray">{pending.items.length} Patienten</Badge>
            ) : null}
          </div>

          {pendingLoading ? (
            <SkeletonText className="h-24 w-full" />
          ) : !pending?.items.length ? (
            <EmptyScreen
              border
              dashedBorder={false}
              Icon="calendar"
              headline="Keine anstehenden Recalls"
              description="Patienten erscheinen hier, wenn ihr Recall-Datum in den nächsten 7 Tagen fällig ist und Recall in Smart-Fill aktiviert ist."
              className="py-10"
            />
          ) : (
            <ul className="divide-subtle divide-y rounded-lg border">
              {pending.items.map((item) => (
                <li key={item.patientId} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-emphasis font-medium">{item.patientName}</p>
                    <p className="text-subtle text-xs">
                      Fällig {formatDate(item.recallDueDate)}
                      {item.daysUntilDue <= 0
                        ? " · heute überfällig"
                        : ` · in ${item.daysUntilDue} Tag(en)`}
                    </p>
                  </div>
                  <Badge variant={item.daysUntilDue <= 0 ? "red" : "orange"}>
                    {item.daysUntilDue <= 0 ? "Überfällig" : "Anstehend"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <div>
            <h3 className="text-emphasis mb-3 font-medium">Letzte Versände</h3>
            {historyLoading ? (
              <SkeletonText className="h-20 w-full" />
            ) : !history?.length ? (
              <p className="text-subtle text-sm">Noch keine Recall-Nachrichten versendet.</p>
            ) : (
              <ul className="divide-subtle divide-y rounded-lg border text-sm">
                {history.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <div>
                      <p className="text-emphasis font-medium">{row.patient.name}</p>
                      <p className="text-subtle text-xs">
                        {row.channel} · Fällig{" "}
                        {formatDate(
                          row.recallDueDate instanceof Date
                            ? row.recallDueDate.toISOString()
                            : String(row.recallDueDate)
                        )}
                      </p>
                    </div>
                    <Badge variant={row.status === "SENT" ? "green" : row.status === "FAILED" ? "red" : "gray"}>
                      {row.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </DentalSettingsShell>
  );
}
