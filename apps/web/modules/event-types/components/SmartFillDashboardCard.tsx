"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";

type SmartFillDashboardCardProps = {
  teamId: number | null | undefined;
};

function formatEuro(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

/**
 * Practice dashboard KPI card — emotional trigger for Smart-Fill ROI.
 */
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
      <div className="border-subtle mb-6 rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-subtle text-sm">Smart-Fill wird geladen…</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Smart-Fill AI</p>
          <h3 className="text-emphasis mt-1 text-lg font-semibold">
            Heute {data.filledToday} freie Slots automatisch gefüllt
          </h3>
          <p className="text-subtle mt-1 text-sm">
            Umsatz-Potential gesichert:{" "}
            <span className="text-emphasis font-semibold text-teal-800">
              +{formatEuro(data.revenueSecuredCents)}
            </span>
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-subtle">Offene Slots</p>
            <p className="text-emphasis text-xl font-bold">{data.openSlots}</p>
          </div>
          <div>
            <p className="text-subtle">SMS ausstehend</p>
            <p className="text-emphasis text-xl font-bold">{data.pendingInvites}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
