"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextArea, TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { useEffect, useState } from "react";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";
import { dentalDesign } from "~/settings/dental/dental-design";

type PracticeInfoSettingsViewProps = {
  teamId: number;
};

export function PracticeInfoSettingsView({ teamId }: PracticeInfoSettingsViewProps) {
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.viewer.dentalPractice.get.useQuery(
    { teamId },
    { enabled }
  );

  const [practiceName, setPracticeName] = useState("");
  const [practiceAddress, setPracticeAddress] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  useEffect(() => {
    if (!data) return;
    setPracticeName(data.practiceName ?? "");
    setPracticeAddress(data.practiceAddress ?? "");
    setEmergencyPhone(data.emergencyPhone ?? "");
  }, [data]);

  const updateMutation = trpc.viewer.dentalPractice.update.useMutation({
    onSuccess: async () => {
      showToast("Praxisdaten gespeichert", "success");
      await utils.viewer.dentalPractice.get.invalidate({ teamId });
    },
    onError: () => {
      showToast("Praxisdaten konnten nicht gespeichert werden", "error");
    },
  });

  if (!enabled) {
    return null;
  }

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="practice-info"
      title="Praxisinformationen"
      description="Adresse und Notfallnummer werden Patienten in der Buchungs-Sidebar angezeigt.">
      <form
        className={dentalDesign.card}
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate({
            teamId,
            practiceName: practiceName.trim() || undefined,
            practiceAddress: practiceAddress.trim() || undefined,
            emergencyPhone: emergencyPhone.trim() || undefined,
          });
        }}>
        <div className="space-y-4 p-6">
          <TextField
            label="Praxisname"
            value={practiceName}
            disabled={isLoading || updateMutation.isPending}
            onChange={(event) => setPracticeName(event.target.value)}
            placeholder="Zahnarztpraxis Dr. Müller"
          />
          <div>
            <Label htmlFor="practice-address">Adresse</Label>
            <TextArea
              id="practice-address"
              rows={3}
              value={practiceAddress}
              disabled={isLoading || updateMutation.isPending}
              onChange={(event) => setPracticeAddress(event.target.value)}
              placeholder="Musterstraße 1, 12345 Musterstadt"
            />
          </div>
          <TextField
            label="Notfallnummer"
            value={emergencyPhone}
            disabled={isLoading || updateMutation.isPending}
            onChange={(event) => setEmergencyPhone(event.target.value)}
            placeholder="+49 123 456789"
          />
          <p className="text-subtle text-xs">
            Diese Angaben erscheinen im Buchungsflow unter dem Termintitel — inkl. Hinweis auf Praxis-Termine
            ohne Video-Call.
          </p>
          <Button type="submit" loading={updateMutation.isPending} disabled={isLoading}>
            Speichern
          </Button>
        </div>
      </form>
    </DentalSettingsShell>
  );
}
