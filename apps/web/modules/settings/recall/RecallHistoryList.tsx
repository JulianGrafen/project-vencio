import { Badge } from "@calcom/ui/components/badge";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { formatDeDate } from "~/settings/dental/format-de-date";
import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalCard, DentalSectionHeader } from "~/settings/dental/dental-ui";

type HistoryRow = {
  id: string;
  channel: string;
  status: string;
  recallDueDate: Date | string;
  patient: { name: string };
};

type RecallHistoryListProps = {
  history: HistoryRow[] | undefined;
  isLoading: boolean;
};

const STATUS_VARIANT: Record<string, "green" | "red" | "gray"> = {
  SENT: "green",
  FAILED: "red",
};

export function RecallHistoryList({ history, isLoading }: RecallHistoryListProps) {
  return (
    <DentalCard padding="lg" className="space-y-4">
      <DentalSectionHeader title="Letzte Versände" />
      {isLoading ? (
        <SkeletonText className="h-20 w-full" />
      ) : !history?.length ? (
        <p className="text-subtle text-sm">Noch keine Recall-Nachrichten versendet.</p>
      ) : (
        <ul className={dentalDesign.listContainer}>
          {history.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
              <div>
                <p className="text-emphasis font-medium">{row.patient.name}</p>
                <p className="text-subtle text-xs">
                  {row.channel} · Fällig {formatDeDate(row.recallDueDate)}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[row.status] ?? "gray"}>{row.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </DentalCard>
  );
}
