import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { formatDeDate } from "~/settings/dental/format-de-date";
import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalAvatar, DentalSectionHeader } from "~/settings/dental/dental-ui";

import type { SmartFillPatientPoolState } from "./useSmartFillPatientPool";

type SmartFillPatientListProps = {
  teamId: number;
  pool: SmartFillPatientPoolState;
};

export function SmartFillPatientList({ teamId, pool }: SmartFillPatientListProps) {
  const hasPatients = (pool.patients?.length ?? 0) > 0;

  return (
    <section className="space-y-4">
      <DentalSectionHeader title="Patienten" count={pool.patients?.length ?? 0} />

      {pool.isLoading ? (
        <div className="space-y-3">
          <SkeletonText className="h-20 w-full" />
          <SkeletonText className="h-20 w-full" />
        </div>
      ) : !hasPatients ? (
        <EmptyScreen
          Icon="users"
          headline="Noch keine Patienten im Pool"
          description="Legen Sie Patienten an, die automatisch per E-Mail eingeladen werden sollen."
          buttonText="Ersten Patienten anlegen"
          buttonOnClick={() => pool.setShowAddForm(true)}
        />
      ) : (
        <ul className={dentalDesign.listContainer}>
          {pool.patients?.map((patient) => (
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
                      ? `Letzter Besuch: ${formatDeDate(patient.lastVisitAt)}`
                      : "Letzter Besuch: wird nach Smart-Fill-Termin gesetzt"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() =>
                    pool.updateMutation.mutate({
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
                    pool.updateMutation.mutate({
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
                  onClick={() => pool.setDeleteTarget({ id: patient.id, name: patient.name })}>
                  Entfernen
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
