import { Badge } from "@calcom/ui/components/badge";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { SkeletonText } from "@calcom/ui/components/skeleton";

import { formatDeDate } from "~/settings/dental/format-de-date";
import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalAvatar, DentalCard, DentalSectionHeader } from "~/settings/dental/dental-ui";

import { RECALL_PENDING_LOOKAHEAD_DAYS } from "@calcom/lib/dental/recall/constants";

type PendingItem = {
  patientId: string;
  patientName: string;
  recallDueDate: string;
  daysUntilDue: number;
};

type RecallPendingListProps = {
  items: readonly PendingItem[] | undefined;
  isLoading: boolean;
};

export function RecallPendingList({ items, isLoading }: RecallPendingListProps) {
  return (
    <DentalCard padding="lg" className="space-y-4">
      <DentalSectionHeader
        title="Anstehende Erinnerungen"
        description={`Nächste ${RECALL_PENDING_LOOKAHEAD_DAYS} Tage`}
        count={items?.length}
      />

      {isLoading ? (
        <SkeletonText className="h-24 w-full" />
      ) : !items?.length ? (
        <EmptyScreen
          border
          dashedBorder={false}
          Icon="calendar"
          headline="Keine anstehenden Recalls"
          description="Patienten erscheinen hier, wenn ihr Recall-Datum in den nächsten 7 Tagen fällig ist und Recall in Smart-Fill aktiviert ist."
          className="py-10"
        />
      ) : (
        <ul className={dentalDesign.listContainer}>
          {items.map((item) => (
            <li key={item.patientId} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <DentalAvatar name={item.patientName} />
                <div>
                  <p className="text-emphasis font-medium">{item.patientName}</p>
                  <p className="text-subtle text-xs">
                    Fällig {formatDeDate(item.recallDueDate)}
                    {item.daysUntilDue <= 0
                      ? " · heute überfällig"
                      : ` · in ${item.daysUntilDue} Tag(en)`}
                  </p>
                </div>
              </div>
              <Badge variant={item.daysUntilDue <= 0 ? "red" : "orange"}>
                {item.daysUntilDue <= 0 ? "Überfällig" : "Anstehend"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </DentalCard>
  );
}
