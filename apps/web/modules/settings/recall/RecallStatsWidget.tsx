"use client";

import { trpc } from "@calcom/trpc/react";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { DentalCard, DentalSectionHeader, DentalStatTile } from "~/settings/dental/dental-ui";

type RecallStatsWidgetProps = {
  teamId: number;
  enabled: boolean;
};

/** Dashboard widget: "Diesen Monat durch Recall generierte Termine: X". */
export function RecallStatsWidget({ teamId, enabled }: RecallStatsWidgetProps) {
  const { data: stats, isLoading } = trpc.viewer.recall.stats.useQuery({ teamId }, { enabled });

  if (!enabled) {
    return null;
  }

  return (
    <DentalCard padding="lg" className="space-y-4">
      <DentalSectionHeader
        title="Recall-Erfolg diesen Monat"
        description="Termine, die über Recall-Erinnerungen gebucht wurden."
      />
      {isLoading ? (
        <SkeletonText className="h-20 w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DentalStatTile
            label="Durch Recall generierte Termine"
            value={stats?.convertedThisMonth ?? 0}
            highlight
          />
          <DentalStatTile label="Versendete Erinnerungen" value={stats?.sentThisMonth ?? 0} />
        </div>
      )}
    </DentalCard>
  );
}
