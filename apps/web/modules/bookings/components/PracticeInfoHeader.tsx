"use client";

import type { DentalPracticeInfo } from "@calcom/lib/dental/team-metadata";
import { Icon } from "@calcom/ui/components/icon";
import classNames from "@calcom/ui/classNames";

type PracticeInfoHeaderProps = {
  practice: DentalPracticeInfo;
  className?: string;
};

export function PracticeInfoHeader({ practice, className }: PracticeInfoHeaderProps) {
  return (
    <div
      className={classNames(
        "border-subtle mb-4 rounded-lg border bg-[#F8FAFC] p-4 text-sm dark:bg-cal-muted",
        className
      )}
      data-testid="practice-info-header">
      <p className="text-emphasis text-base font-semibold">{practice.practiceName}</p>
      {practice.practiceAddress ? (
        <p className="text-default mt-2 flex items-start gap-2">
          <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C81]" />
          <span>{practice.practiceAddress}</span>
        </p>
      ) : null}
      {practice.emergencyPhone ? (
        <p className="text-default mt-2 flex items-center gap-2">
          <Icon name="phone" className="h-4 w-4 shrink-0 text-[#E11D48]" />
          <span>
            Notfall:{" "}
            <a href={`tel:${practice.emergencyPhone}`} className="font-medium text-[#0F4C81] hover:underline">
              {practice.emergencyPhone}
            </a>
          </span>
        </p>
      ) : null}
      <p className="text-subtle mt-3 flex items-center gap-2 text-xs">
        <Icon name="building" className="h-3.5 w-3.5 shrink-0" />
        Termin in der Praxis — kein Video-Call
      </p>
    </div>
  );
}
