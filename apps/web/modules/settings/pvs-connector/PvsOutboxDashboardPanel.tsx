type PvsOutboxDashboardData = {
  pending: number;
  processing: number;
  failed: number;
  completed: number;
  recentJobs: Array<{
    id: string;
    bookingUid: string;
    operation: string;
    status: string;
    attempts: number;
    lastError: string | null;
  }>;
};

type PvsOutboxDashboardPanelProps = {
  dashboard: PvsOutboxDashboardData | undefined;
  isLoading: boolean;
};

export function PvsOutboxDashboardPanel({ dashboard, isLoading }: PvsOutboxDashboardPanelProps) {
  if (isLoading || !dashboard) {
    return (
      <div className="space-y-3">
        <h3 className="text-emphasis font-medium">Sync-Outbox Status</h3>
        <p className="text-subtle text-sm">Laden…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-emphasis font-medium">Sync-Outbox Status</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Ausstehend" value={dashboard.pending} />
        <StatCard label="In Bearbeitung" value={dashboard.processing} />
        <StatCard label="Fehlgeschlagen" value={dashboard.failed} valueClassName="text-red-700" />
        <StatCard label="Abgeschlossen" value={dashboard.completed} valueClassName="text-green-700" />
      </div>

      {dashboard.recentJobs.length > 0 ? (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-subtle text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Termin</th>
                <th className="px-3 py-2">Operation</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Versuche</th>
                <th className="px-3 py-2">Fehler</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentJobs.map((job) => (
                <tr key={job.id} className="border-subtle border-t">
                  <td className="px-3 py-2 font-mono text-xs">{job.bookingUid.slice(0, 10)}…</td>
                  <td className="px-3 py-2">{job.operation.replace("_APPOINTMENT", "")}</td>
                  <td className="px-3 py-2">{job.status}</td>
                  <td className="px-3 py-2">{job.attempts}</td>
                  <td className="text-subtle max-w-[12rem] truncate px-3 py-2 text-xs">
                    {job.lastError ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-subtle text-sm">Noch keine Sync-Jobs in der Outbox.</p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-subtle text-xs">{label}</p>
      <p className={`text-emphasis text-2xl font-bold ${valueClassName ?? ""}`}>{value}</p>
    </div>
  );
}
