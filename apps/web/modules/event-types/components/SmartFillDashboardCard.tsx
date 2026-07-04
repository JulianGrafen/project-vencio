"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalCard, DentalStatTile } from "~/settings/dental/dental-ui";

type SmartFillDashboardCardProps = {
  teamId: number | null | undefined;
};

function formatEuro(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function SmartFillDashboardCard({ teamId }: SmartFillDashboardCardProps) {
  const enabled = isDentalClientComplianceMode() && teamId && teamId > 0;

  const { data, isLoading } = trpc.viewer.smartFill.dashboard.useQuery(
    { teamId: teamId ?? 0 },
    { enabled: Boolean(enabled) }
  );

  if (!enabled || !data?.enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <DentalCard className="mb-6">
        <SkeletonText className="h-4 w-40" />
        <SkeletonText className="mt-3 h-8 w-72" />
      </DentalCard>
    );
  }

  const settingsHref = `/settings/smart-fill?teamId=${teamId}`;

  return (
    <DentalCard variant="accent" padding="lg" className="mb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className={dentalDesign.eyebrow}>Smart-Fill AI</p>
          <h3 className="text-emphasis text-xl font-semibold tracking-tight">
            Heute {data.filledToday} freie Slots automatisch gefüllt
          </h3>
          <p className="text-subtle text-sm">
            Umsatz gesichert{" "}
            <span className="text-emphasis font-semibold text-teal-800">
              +{formatEuro(data.revenueSecuredCents)}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <DentalStatTile label="Offene Slots" value={data.openSlots} />
            <DentalStatTile label="E-Mail ausstehend" value={data.pendingInvites} highlight />
          </div>
          <Button href={settingsHref} color="secondary">
            Patientenpool
          </Button>
        </div>
      </div>
    </DentalCard>
  );
}
