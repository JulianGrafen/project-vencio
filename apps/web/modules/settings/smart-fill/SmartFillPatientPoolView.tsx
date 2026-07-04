"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { Button } from "@calcom/ui/components/button";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";

import { SmartFillDeleteDialog } from "./SmartFillDeleteDialog";
import { SmartFillPatientForm } from "./SmartFillPatientForm";
import { SmartFillPatientList } from "./SmartFillPatientList";
import { useSmartFillPatientPool } from "./useSmartFillPatientPool";

type SmartFillPatientPoolViewProps = {
  teamId: number;
};

export function SmartFillPatientPoolView({ teamId }: SmartFillPatientPoolViewProps) {
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const pool = useSmartFillPatientPool(teamId, enabled);

  if (!enabled) {
    return null;
  }

  const hasPatients = (pool.patients?.length ?? 0) > 0;

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="smart-fill"
      title="Smart-Fill Patientenpool"
      description="Warteliste und Recall-Kandidaten — automatische SMS bei freien Terminen."
      headerAction={
        hasPatients ? (
          <Button
            color={pool.showAddForm ? "secondary" : "primary"}
            onClick={() => pool.setShowAddForm((v) => !v)}>
            {pool.showAddForm ? "Abbrechen" : "Patient hinzufügen"}
          </Button>
        ) : undefined
      }>
      {(pool.showAddForm || !hasPatients) && <SmartFillPatientForm pool={pool} />}
      <SmartFillPatientList teamId={teamId} pool={pool} />
      <SmartFillDeleteDialog teamId={teamId} pool={pool} />
    </DentalSettingsShell>
  );
}
