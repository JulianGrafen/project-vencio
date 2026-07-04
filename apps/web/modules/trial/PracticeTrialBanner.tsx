import Link from "next/link";

import { PRACTICE_TRIAL_MAX_BOOKINGS } from "@calcom/lib/dental/trial/trial.constants";
import { TopBanner } from "@calcom/ui/components/top-banner";

export type PracticeTrialBannerData = {
  daysRemaining: number;
  bookingsRemaining: number;
  trialBookingsCount: number;
};

type PracticeTrialBannerProps = {
  data: PracticeTrialBannerData;
};

export function PracticeTrialBanner({ data }: PracticeTrialBannerProps) {
  const dayLabel = data.daysRemaining === 1 ? "Tag" : "Tage";
  const bookingPart =
    data.bookingsRemaining < PRACTICE_TRIAL_MAX_BOOKINGS
      ? ` · noch ${data.bookingsRemaining} Test-Termine`
      : "";

  return (
    <TopBanner
      text={`Sie befinden sich in der Testphase. Noch ${data.daysRemaining} ${dayLabel} verbleiben${bookingPart}.`}
      variant="warning"
      actions={
        <Link href="/upgrade" className="border-b border-b-black font-medium">
          Jetzt upgraden
        </Link>
      }
    />
  );
}
