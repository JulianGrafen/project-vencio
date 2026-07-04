"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { trpc } from "@calcom/trpc/react";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";
import { DentalCard, DentalSectionHeader } from "~/settings/dental/dental-ui";

import { RecallHistoryList } from "./RecallHistoryList";
import { RecallPendingList } from "./RecallPendingList";
import { RecallSettingsForm } from "./RecallSettingsForm";
import { RecallStatsWidget } from "./RecallStatsWidget";

type RecallSettingsViewProps = {
  teamId: number;
};

export function RecallSettingsView({ teamId }: RecallSettingsViewProps) {
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

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="recall"
      title="Recall"
      description="Automatische Prophylaxe-Erinnerungen — konfigurieren Sie Intervall, Kanäle und sehen Sie anstehende Erinnerungen.">
      <div className="grid gap-8 lg:grid-cols-5">
        <DentalCard padding="lg" className="space-y-4 lg:col-span-2">
          <DentalSectionHeader title="Einstellungen" description="Intervall, Kanäle und Aktivierung." />
          {settings ? (
            <RecallSettingsForm
              teamId={teamId}
              settings={{
                enabled: settings.enabled,
                intervalMonths: settings.intervalMonths,
                toleranceDays: settings.toleranceDays,
                smsEnabled: settings.smsEnabled,
                practiceName: settings.practiceName ?? "",
                bookingSlug: settings.bookingSlug,
                emailSubject: settings.emailSubject,
                emailHtmlTemplate: settings.emailHtmlTemplate,
                emailTextTemplate: settings.emailTextTemplate,
                smsTemplate: settings.smsTemplate,
              }}
              isLoading={settingsLoading}
            />
          ) : (
            <RecallSettingsForm
              teamId={teamId}
              settings={{
                enabled: false,
                intervalMonths: 6,
                toleranceDays: 3,
                smsEnabled: false,
                practiceName: "",
                bookingSlug: null,
                emailSubject: "Zeit für Ihre Prophylaxe",
                emailHtmlTemplate: "",
                emailTextTemplate: null,
                smsTemplate: null,
              }}
              isLoading={settingsLoading}
            />
          )}
        </DentalCard>

        <div className="space-y-6 lg:col-span-3">
          <RecallStatsWidget teamId={teamId} enabled={enabled} />
          <RecallPendingList items={pending?.items} isLoading={pendingLoading} />
          <RecallHistoryList history={history} isLoading={historyLoading} />
        </div>
      </div>
    </DentalSettingsShell>
  );
}
