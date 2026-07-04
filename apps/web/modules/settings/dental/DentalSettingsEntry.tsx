"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

type DentalSettingsEntryProps = {
  teamId: number;
  children: ReactNode;
};

export function DentalSettingsEntry({ teamId, children }: DentalSettingsEntryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const enabled = isDentalClientComplianceMode();

  const { data, isLoading } = trpc.viewer.loggedInViewerRouter.teamsAndUserProfilesQuery.useQuery(
    {},
    { enabled }
  );

  const teams = useMemo(
    () =>
      data
        ?.filter((entry): entry is typeof entry & { teamId: number } => entry.teamId !== null)
        .map((entry) => ({ id: entry.teamId, name: entry.name ?? `Team ${entry.teamId}` })) ?? [],
    [data]
  );

  useEffect(() => {
    if (!enabled || isLoading || teamId > 0 || teams.length !== 1) return;
    router.replace(`${pathname}?teamId=${teams[0].id}`);
  }, [enabled, isLoading, pathname, router, teamId, teams]);

  if (!enabled) {
    return (
      <EmptyScreen
        Icon="info"
        headline="Praxis-Funktionen nicht verfügbar"
        description="Dental Compliance Mode ist für diese Umgebung nicht aktiviert."
        buttonRaw={
          <Button href="/settings/my-account/general" color="secondary">
            Zu den Einstellungen
          </Button>
        }
      />
    );
  }

  if (isLoading && teamId <= 0) {
    return (
      <div className="space-y-3">
        <SkeletonText className="h-8 w-64" />
        <SkeletonText className="h-4 w-96" />
      </div>
    );
  }

  if (teamId <= 0) {
    if (teams.length === 0) {
      return (
        <EmptyScreen
          Icon="users"
          headline="Keine Praxis gefunden"
          description="Legen Sie zuerst ein Team an oder treten Sie einer Praxis bei, um Smart-Fill und Recall zu nutzen."
          buttonRaw={<Button href="/teams">Teams verwalten</Button>}
        />
      );
    }

    return (
      <EmptyScreen
        Icon="building"
        headline="Praxis auswählen"
        description="Wählen Sie die Praxis, deren Einstellungen Sie bearbeiten möchten."
        buttonRaw={
          <div className="flex flex-wrap justify-center gap-2">
            {teams.map((team) => (
              <Button key={team.id} href={`${pathname}?teamId=${team.id}`} color="secondary">
                {team.name}
              </Button>
            ))}
          </div>
        }
      />
    );
  }

  return <>{children}</>;
}
