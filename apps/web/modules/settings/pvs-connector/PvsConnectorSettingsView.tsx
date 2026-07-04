"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { useState } from "react";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";
import { PvsCredentialManager } from "~/settings/pvs-connector/PvsCredentialManager";
import { PvsOutboxDashboardPanel } from "~/settings/pvs-connector/PvsOutboxDashboardPanel";

type PvsConnectorSettingsViewProps = {
  teamId: number;
};

export function PvsConnectorSettingsView({ teamId }: PvsConnectorSettingsViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [showSetupDetails, setShowSetupDetails] = useState(false);

  const { data: credentials, isLoading: credentialsLoading } =
    trpc.viewer.pvsConnector.listCredentials.useQuery({ teamId }, { enabled });

  const { data: dashboard, isLoading: dashboardLoading } = trpc.viewer.pvsConnector.dashboard.useQuery(
    { teamId },
    { enabled, refetchInterval: 30_000 }
  );

  const createMutation = trpc.viewer.pvsConnector.createCredential.useMutation({
    onSuccess: async (result) => {
      setRevealedKey(result.rawApiKey);
      await utils.viewer.pvsConnector.listCredentials.invalidate({ teamId });
    },
  });

  const revokeMutation = trpc.viewer.pvsConnector.revokeCredential.useMutation({
    onSuccess: async () => {
      await utils.viewer.pvsConnector.listCredentials.invalidate({ teamId });
    },
  });

  if (!enabled) {
    return null;
  }

  const hasActiveCredential = credentials?.some((credential) => credential.isActive);

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="pvs-connector"
      title="PVS Sync"
      description="Verbinden Sie Ihre Praxissoftware — Termine werden automatisch synchronisiert, sobald der lokale Connector läuft.">
      <PvsOutboxDashboardPanel dashboard={dashboard} isLoading={dashboardLoading} />

      {!hasActiveCredential && !credentialsLoading ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-medium">In 2 Schritten startklar</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
            <li>API-Schlüssel unten erstellen und sicher speichern</li>
            <li>Connector auf dem Praxis-Server mit Team-ID {teamId} starten</li>
          </ol>
        </div>
      ) : null}

      <button
        type="button"
        className="text-subtle text-sm underline"
        onClick={() => setShowSetupDetails((value) => !value)}>
        {showSetupDetails ? "Technische Details ausblenden" : "Technische Details für IT anzeigen"}
      </button>

      {showSetupDetails ? (
        <div className="rounded-lg border p-4 text-sm">
          <p className="text-emphasis font-medium">Connector-Start (Praxis-Server)</p>
          <code className="mt-2 block break-all rounded bg-subtle p-3 text-xs">
            PVS_CLOUD_BASE_URL=… PVS_CONNECTOR_API_KEY=… PVS_TEAM_ID={teamId} yarn pvs-connector
          </code>
          <ul className="text-subtle mt-3 list-inside list-disc space-y-1 text-xs">
            <li>POST /api/pvs/outbox/poll — ausstehende Termine abholen</li>
            <li>POST /api/pvs/outbox/ack — Erfolg oder Fehler melden</li>
          </ul>
        </div>
      ) : null}

      <PvsCredentialManager
        teamId={teamId}
        credentials={credentials}
        isLoading={credentialsLoading}
        onCreate={(input) => createMutation.mutate(input)}
        onRevoke={(input) => revokeMutation.mutate(input)}
        isCreating={createMutation.isPending}
        isRevoking={revokeMutation.isPending}
        revealedKey={revealedKey}
        onDismissRevealedKey={() => setRevealedKey(null)}
      />
    </DentalSettingsShell>
  );
}
