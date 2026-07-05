import { getQueryParam } from "@calcom/features/bookings/Booker/utils/query-param";
import { localStorage } from "@calcom/lib/webstorage";

import { isDentalClientComplianceMode } from "../compliance-config";

/** Overlay calendar is hidden in dental compliance; slot clicks must use the standard booker flow. */
export function isOverlayCalendarSlotSelectionEnabled(): boolean {
  if (isDentalClientComplianceMode()) {
    return false;
  }

  return (
    getQueryParam("overlayCalendar") === "true" ||
    Boolean(localStorage.getItem("overlayCalendarSwitchDefault"))
  );
}
