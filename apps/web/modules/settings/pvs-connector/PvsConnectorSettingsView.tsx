"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import Link from "next/link";
import { useState } from "react";

type PvsConnectorSettingsViewProps = {
  teamId: number;
};

export function PvsConnectorSettingsView({ teamId }: PvsConnectorSettingsViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0;

  const [label, setLabel] = useState("LAN-Connector");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const { data: credentials, isLoading } = trpc.viewer.pvsConnector.listCredentials.useQuery(
    { teamId },
    { enabled }
  );

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
        <p className="font-medium">Connector-Endpunkte</p>
        <p className="font-medium">Lokaler Connector</p>
        <p className="mt-1 text-xs">
          Start: <code>PVS_CLOUD_BASE_URL=… PVS_CONNECTOR_API_KEY=… PVS_TEAM_ID={teamId} yarn pvs-connector</code>
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          <li>POST /api/pvs/outbox/poll — ausstehende Termine abholen</li>
          <li>POST /api/pvs/outbox/ack — Erfolg/Fehler bestätigen</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-emphasis font-medium">Sync-Outbox Status</h3>
        {dashboardLoading || !dashboard ? (
          <p className="text-subtle text-sm">Laden…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-md border p-3">
                <p className="text-subtle text-xs">Ausstehend</p>
                <p className="text-emphasis text-2xl font-bold">{dashboard.pending}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-subtle text-xs">In Bearbeitung</p>
                <p className="text-emphasis text-2xl font-bold">{dashboard.processing}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-subtle text-xs">Fehlgeschlagen</p>
                <p className="text-2xl font-bold text-red-700">{dashboard.failed}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-subtle text-xs">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-700">{dashboard.completed}</p>
              </div>
            </div>

            {dashboard.recentJobs.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-subtle text-subtle text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2">Termin</th>
                      <th className="px-3 py-2">Operation</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Versuche</th>
                      <th className="px-3 py-2">Fehler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentJobs.map((job) => (
                      <tr key={job.id} className="border-subtle border-t">
                        <td className="px-3 py-2 font-mono text-xs">{job.bookingUid.slice(0, 10)}…</td>
                        <td className="px-3 py-2">{job.operation.replace("_APPOINTMENT", "")}</td>
                        <td className="px-3 py-2">{job.status}</td>
                        <td className="px-3 py-2">{job.attempts}</td>
                        <td className="text-subtle max-w-[12rem] truncate px-3 py-2 text-xs">
                          {job.lastError ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-subtle text-sm">Noch keine Sync-Jobs in der Outbox.</p>
            )}
          </>
        )}
      </div>

      {revealedKey ? (
        <div className="space-y-3 rounded-md border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-medium text-teal-900">Neuer API-Schlüssel — nur jetzt sichtbar</p>
          <code className="block break-all rounded bg-white p-3 text-xs">{revealedKey}</code>
          <Button color="secondary" onClick={() => setRevealedKey(null)}>
            Schließen
          </Button>
        </div>
      ) : null}

      <form
        className="space-y-4 rounded-md border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate({ teamId, label: label.trim() || "default" });
        }}>
        <h3 className="text-emphasis font-medium">Neuen Connector-Schlüssel erstellen</h3>
        <div>
          <Label htmlFor="pvs-label">Bezeichnung</Label>
          <TextField
            id="pvs-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="z. B. Praxis-Server Dampsoft"
          />
        </div>
        <Button type="submit" loading={createMutation.isPending}>
          Schlüssel generieren
        </Button>
      </form>

      <div className="space-y-3">
        <h3 className="text-emphasis font-medium">Aktive Schlüssel</h3>
        {isLoading ? (
          <p className="text-subtle text-sm">Laden…</p>
        ) : credentials?.length ? (
          <ul className="divide-subtle divide-y rounded-md border">
            {credentials.map((credential) => (
              <li key={credential.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-emphasis font-medium">{credential.label}</p>
                  <p className="text-subtle font-mono text-xs">
                    {credential.keyPrefix}…
                    {credential.isActive ? (
                      <span className="ml-2 text-green-700">aktiv</span>
                    ) : (
                      <span className="ml-2 text-red-700">widerrufen</span>
                    )}
                  </p>
                  {credential.lastUsedAt ? (
                    <p className="text-subtle text-xs">
                      Zuletzt genutzt: {new Date(credential.lastUsedAt).toLocaleString("de-DE")}
                    </p>
                  ) : null}
                </div>
                {credential.isActive ? (
                  <Button
                    color="destructive"
                    loading={revokeMutation.isPending}
                    onClick={() =>
                      revokeMutation.mutate({ teamId, credentialId: credential.id })
                    }>
                    Widerrufen
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-subtle text-sm">Noch keine Connector-Schlüssel angelegt.</p>
        )}
      </div>

      <div className="text-subtle flex flex-wrap gap-4 text-sm">
        <Link className="text-emphasis underline" href={`/settings/smart-fill?teamId=${teamId}`}>
          Smart-Fill Patientenpool
        </Link>
        <Link className="text-emphasis underline" href={`/settings/treatment-resources?teamId=${teamId}`}>
          Behandlungsressourcen
        </Link>
      </div>
    </div>
  );
}
