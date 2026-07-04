"use client";

import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { useState } from "react";

type Credential = {
  id: string;
  label: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt: Date | string | null;
};

type PvsCredentialManagerProps = {
  teamId: number;
  credentials: Credential[] | undefined;
  isLoading: boolean;
  onCreate: (input: { teamId: number; label: string }) => void;
  onRevoke: (input: { teamId: number; credentialId: string }) => void;
  isCreating: boolean;
  isRevoking: boolean;
  revealedKey: string | null;
  onDismissRevealedKey: () => void;
};

export function PvsCredentialManager({
  teamId,
  credentials,
  isLoading,
  onCreate,
  onRevoke,
  isCreating,
  isRevoking,
  revealedKey,
  onDismissRevealedKey,
}: PvsCredentialManagerProps) {
  const [label, setLabel] = useState("LAN-Connector");

  return (
    <>
      {revealedKey ? (
        <div className="space-y-3 rounded-md border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-medium text-teal-900">Neuer API-Schlüssel — nur jetzt sichtbar</p>
          <code className="block break-all rounded bg-white p-3 text-xs">{revealedKey}</code>
          <Button color="secondary" onClick={onDismissRevealedKey}>
            Schließen
          </Button>
        </div>
      ) : null}

      <form
        className="space-y-4 rounded-md border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate({ teamId, label: label.trim() || "default" });
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
        <Button type="submit" loading={isCreating}>
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
                    loading={isRevoking}
                    onClick={() => onRevoke({ teamId, credentialId: credential.id })}>
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
    </>
  );
}
