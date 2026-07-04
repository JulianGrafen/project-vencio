"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";
import Link from "next/link";
import { useState } from "react";

type SmartFillPatientPoolViewProps = {
  teamId: number;
};

export function SmartFillPatientPoolView({ teamId }: SmartFillPatientPoolViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [waitlistEnabled, setWaitlistEnabled] = useState(true);
  const [priorityScore, setPriorityScore] = useState("0");

  const { data: patients, isLoading } = trpc.viewer.smartFill.listPatients.useQuery(
    { teamId },
    { enabled }
  );

  const createMutation = trpc.viewer.smartFill.createPatient.useMutation({
    onSuccess: async () => {
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPriorityScore("0");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
    },
  });

  const updateMutation = trpc.viewer.smartFill.updatePatient.useMutation({
    onSuccess: async () => {
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
    },
  });

  const deleteMutation = trpc.viewer.smartFill.deletePatient.useMutation({
    onSuccess: async () => {
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
    },
  });

  if (!enabled) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-emphasis text-lg font-semibold">Smart-Fill Patientenpool</h2>
        <p className="text-subtle text-sm">
          Warteliste und Recall-Kandidaten für automatische SMS-Einladungen bei freien Terminen.
        </p>
      </div>

      <form
        className="space-y-4 rounded-md border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate({
            teamId,
            name,
            email,
            phoneNumber,
            waitlistEnabled,
            priorityScore: Number(priorityScore) || 0,
          });
        }}>
        <h3 className="text-emphasis font-medium">Patient hinzufügen</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sf-name">Name</Label>
            <TextField id="sf-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sf-email">E-Mail</Label>
            <TextField
              id="sf-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sf-phone">Telefon (SMS)</Label>
            <TextField
              id="sf-phone"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+49170..."
            />
          </div>
          <div>
            <Label htmlFor="sf-priority">Priorität (0–1000)</Label>
            <TextField
              id="sf-priority"
              type="number"
              min={0}
              max={1000}
              value={priorityScore}
              onChange={(e) => setPriorityScore(e.target.value)}
            />
          </div>
        </div>
        <SettingsToggle
          title="Warteliste aktiv"
          description="Patient erhält SMS bei freien Terminen"
          checked={waitlistEnabled}
          onCheckedChange={setWaitlistEnabled}
        />
        <Button type="submit" loading={createMutation.isPending}>
          Patient speichern
        </Button>
      </form>

      <ul className="divide-subtle divide-y rounded-md border">
        {isLoading && <li className="text-subtle p-4 text-sm">Laden…</li>}
        {!isLoading && patients?.length === 0 && (
          <li className="text-subtle p-4 text-sm">Noch keine Patienten im Pool.</li>
        )}
        {patients?.map((patient) => (
          <li key={patient.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-emphasis font-medium">{patient.name}</p>
              <p className="text-subtle text-xs">
                {patient.phoneNumber} · {patient.email}
                {patient.waitlistEnabled ? " · Warteliste" : ""}
                {patient.priorityScore > 0 ? ` · Prio ${patient.priorityScore}` : ""}
              </p>
              {patient.lastVisitAt ? (
                <p className="text-subtle text-xs">
                  Letzter Besuch: {new Date(patient.lastVisitAt).toLocaleDateString("de-DE")}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                color="secondary"
                onClick={() =>
                  updateMutation.mutate({
                    teamId,
                    patientId: patient.id,
                    waitlistEnabled: !patient.waitlistEnabled,
                  })
                }>
                {patient.waitlistEnabled ? "Warteliste aus" : "Warteliste an"}
              </Button>
              <Button
                color="destructive"
                onClick={() => deleteMutation.mutate({ teamId, patientId: patient.id })}>
                Entfernen
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-subtle flex flex-wrap gap-4 text-sm">
        <Link className="text-emphasis underline" href={`/settings/pvs-connector?teamId=${teamId}`}>
          PVS Connector
        </Link>
        <Link className="text-emphasis underline" href={`/settings/treatment-resources?teamId=${teamId}`}>
          Behandlungsressourcen
        </Link>
      </div>
    </div>
  );
}
