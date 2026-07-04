"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { DentalSettingsShell } from "~/settings/dental/DentalSettingsShell";
import { DentalCard, DentalSectionHeader } from "~/settings/dental/dental-ui";

import { MedicalCategoryRow } from "./MedicalCategoryRow";

type MedicalCategoriesSettingsViewProps = {
  teamId: number;
};

export function MedicalCategoriesSettingsView({ teamId }: MedicalCategoriesSettingsViewProps) {
  const enabled = isDentalClientComplianceMode() && teamId > 0;
  const { data: eventTypes, isLoading } = trpc.viewer.medicalProfiles.list.useQuery(
    { teamId },
    { enabled }
  );

  if (!enabled) {
    return null;
  }

  return (
    <DentalSettingsShell
      teamId={teamId}
      activeTab="medical-categories"
      title="Behandlungskategorien"
      description="Kategorien und Versicherungs-Einschränkungen für die öffentliche Buchungsseite.">
      <DentalCard variant="accent" padding="lg">
        <DentalSectionHeader
          title="Terminarten kategorisieren"
          description="Patienten sehen Termine gruppiert nach Kategorie — Schmerzbehandlung immer zuerst."
          count={eventTypes?.length}
        />
      </DentalCard>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonText className="h-24 w-full" />
          <SkeletonText className="h-24 w-full" />
        </div>
      ) : eventTypes?.length ? (
        <div className="space-y-4">
          {eventTypes.map((eventType) => (
            <MedicalCategoryRow key={eventType.id} teamId={teamId} eventType={eventType} />
          ))}
        </div>
      ) : (
        <DentalCard variant="muted">
          <p className="text-subtle text-sm">
            Keine Terminarten gefunden. Legen Sie zuerst Event-Types für Ihre Praxis an.
          </p>
        </DentalCard>
      )}
    </DentalSettingsShell>
  );
}
