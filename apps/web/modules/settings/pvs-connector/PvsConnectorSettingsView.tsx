"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { useState } from "react";

import { DentalSettingsCrossLinks } from "~/settings/dental/DentalSettingsCrossLinks";
import { PvsCredentialManager } from "~/settings/pvs-connector/PvsCredentialManager";
import { PvsOutboxDashboardPanel } from "~/settings/pvs-connector/PvsOutboxDashboardPanel";

type PvsConnectorSettingsViewProps = {
  teamId: number;
};

export function PvsConnectorSettingsView({ teamId }: PvsConnectorSettingsViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

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

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-emphasis text-lg font-semibold">PVS Connector</h2>
        <p className="text-subtle text-sm">
          API-Schlüssel für den lokalen PVS-Connector (Dampsoft, Z1, …). Der Connector pollt{" "}
          <code className="text-xs">/api/pvs/outbox/poll</code> mit Bearer-Token und Team-ID.
        </p>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Lokaler Connector</p>
        <p className="mt-1 text-xs">
          Start:{" "}
          <code>
            PVS_CLOUD_BASE_URL=… PVS_CONNECTOR_API_KEY=… PVS_TEAM_ID={teamId} yarn pvs-connector
          </code>
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          <li>POST /api/pvs/outbox/poll — ausstehende Termine abholen</li>
          <li>POST /api/pvs/outbox/ack — Erfolg/Fehler bestätigen</li>
        </ul>
      </div>

      <PvsOutboxDashboardPanel dashboard={dashboard} isLoading={dashboardLoading} />

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

      <DentalSettingsCrossLinks teamId={teamId} current="pvs-connector" />
    </div>
  );
}
