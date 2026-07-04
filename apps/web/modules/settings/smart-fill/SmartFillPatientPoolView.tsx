"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@calcom/ui/components/dialog";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Label, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";
import {
  DentalAvatar,
  DentalCard,
  DentalHelpText,
  DentalSectionHeader,
} from "~/settings/dental/dental-ui";

type SmartFillPatientPoolViewProps = {
  teamId: number;
};

export function SmartFillPatientPoolView({ teamId }: SmartFillPatientPoolViewProps) {
  const utils = trpc.useUtils();
  const enabled = isDentalClientComplianceMode() && teamId > 0;

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [waitlistEnabled, setWaitlistEnabled] = useState(true);
  const [recallEnabled, setRecallEnabled] = useState(true);
  const [priorityScore, setPriorityScore] = useState("0");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

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
      setShowAddForm(false);
      showToast("Patient hinzugefügt", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  const updateMutation = trpc.viewer.smartFill.updatePatient.useMutation({
    onSuccess: async () => {
      showToast("Patient aktualisiert", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Aktualisierung fehlgeschlagen", "error"),
  });

  const deleteMutation = trpc.viewer.smartFill.deletePatient.useMutation({
    onSuccess: async () => {
      setDeleteTarget(null);
      showToast("Patient entfernt", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Löschen fehlgeschlagen", "error"),
  });

  if (!enabled) {
    return null;
  }

  const hasPatients = (patients?.length ?? 0) > 0;

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="smart-fill"
      title="Smart-Fill Patientenpool"
      description="Warteliste und Recall-Kandidaten — automatische SMS bei freien Terminen."
      headerAction={
        hasPatients ? (
          <Button color={showAddForm ? "secondary" : "primary"} onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? "Abbrechen" : "Patient hinzufügen"}
          </Button>
        ) : undefined
      }>
      {(showAddForm || !hasPatients) && (
        <DentalCard variant="accent" padding="lg">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate({
                teamId,
                name,
                email,
                phoneNumber,
                waitlistEnabled,
                recallEnabled,
                priorityScore: Number(priorityScore) || 0,
              });
            }}>
            <DentalSectionHeader
              title="Neuen Patienten anlegen"
              description="E-Mail und Telefon für Smart-Fill-SMS und Recall-Erinnerungen."
            />

            <div className={dentalDesign.formGrid}>
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
                  placeholder="+49 170 …"
                />
              </div>
              <div>
                <Label htmlFor="sf-priority">Priorität</Label>
                <TextField
                  id="sf-priority"
                  type="number"
                  min={0}
                  max={1000}
                  value={priorityScore}
                  onChange={(e) => setPriorityScore(e.target.value)}
                />
                <DentalHelpText>Höhere Werte = bevorzugt bei freien Terminen (0 = normal)</DentalHelpText>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-subtle bg-default/80 p-4">
              <SettingsToggle
                title="Smart-Fill Warteliste"
                description="SMS-Einladung bei kurzfristig freigewordenen Terminen"
                checked={waitlistEnabled}
                onCheckedChange={setWaitlistEnabled}
              />
              <SettingsToggle
                title="Recall aktiv"
                description="Prophylaxe-Erinnerung nach konfiguriertem Intervall"
                checked={recallEnabled}
                onCheckedChange={setRecallEnabled}
              />
            </div>

            <Button type="submit" loading={createMutation.isPending}>
              Patient speichern
            </Button>
          </form>
        </DentalCard>
      )}

      <section className="space-y-4">
        <DentalSectionHeader title="Patienten" count={patients?.length ?? 0} />

        {isLoading ? (
          <div className="space-y-3">
            <SkeletonText className="h-20 w-full" />
            <SkeletonText className="h-20 w-full" />
          </div>
        ) : !hasPatients ? (
          <EmptyScreen
            Icon="users"
            headline="Noch keine Patienten im Pool"
            description="Legen Sie Patienten an, die automatisch per SMS eingeladen werden sollen."
            buttonText="Ersten Patienten anlegen"
            buttonOnClick={() => setShowAddForm(true)}
          />
        ) : (
          <ul className={dentalDesign.listContainer}>
            {patients?.map((patient) => (
              <li key={patient.id} className={dentalDesign.listRow}>
                <div className="flex min-w-0 flex-1 gap-4">
                  <DentalAvatar name={patient.name} />
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-emphasis truncate font-semibold">{patient.name}</p>
                      {patient.waitlistEnabled ? <Badge variant="green">Warteliste</Badge> : null}
                      {patient.recallEnabled ? <Badge variant="blue">Recall</Badge> : null}
                      {patient.priorityScore > 0 ? (
                        <Badge variant="gray">Prio {patient.priorityScore}</Badge>
                      ) : null}
                    </div>
                    <p className="text-subtle truncate text-sm">
                      {patient.phoneNumber} · {patient.email}
                    </p>
                    <p className="text-subtle text-xs">
                      {patient.lastVisitAt
                        ? `Letzter Besuch: ${new Date(patient.lastVisitAt).toLocaleDateString("de-DE")}`
                        : "Letzter Besuch: wird nach Smart-Fill-Termin gesetzt"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <Button
                    color="secondary"
                    size="sm"
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
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      updateMutation.mutate({
                        teamId,
                        patientId: patient.id,
                        recallEnabled: !patient.recallEnabled,
                      })
                    }>
                    {patient.recallEnabled ? "Recall aus" : "Recall an"}
                  </Button>
                  <Button
                    color="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget({ id: patient.id, name: patient.name })}>
                    Entfernen
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent type="confirmation" title="Patient entfernen?">
          <DialogHeader title="Patient entfernen?" />
          <p className="text-subtle text-sm">
            {deleteTarget?.name} wird aus Warteliste und Recall entfernt. Diese Aktion kann nicht rückgängig
            gemacht werden.
          </p>
          <DialogFooter>
            <DialogClose color="secondary">Abbrechen</DialogClose>
            <Button
              color="destructive"
              loading={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate({ teamId, patientId: deleteTarget.id });
              }}>
              Entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DentalSettingsShell>
  );
}
