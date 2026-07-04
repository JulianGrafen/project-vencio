"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";

import { TreatmentResourceDeactivateDialog } from "./TreatmentResourceDeactivateDialog";
import { TreatmentResourceForm } from "./TreatmentResourceForm";
import { TreatmentResourceList } from "./TreatmentResourceList";
import { useTreatmentResourcesSettings } from "./useTreatmentResourcesSettings";

type TreatmentResourcesSettingsViewProps = {
  teamId: number;
};

export function TreatmentResourcesSettingsView({ teamId }: TreatmentResourcesSettingsViewProps) {
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const settings = useTreatmentResourcesSettings(teamId, enabled);

  if (!enabled) {
    return null;
  }

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="treatment-resources"
      title="Behandlungsressourcen"
      description="Stühle, Räume und Geräte, die Patienten bei der Online-Buchung auswählen können.">
      <TreatmentResourceForm settings={settings} />
      <TreatmentResourceList teamId={teamId} settings={settings} />
      <TreatmentResourceDeactivateDialog teamId={teamId} settings={settings} />
    </DentalSettingsShell>
  );
}
