import { applyDentalBookingFieldPolicy } from "@calcom/lib/dental/booking-fields";
import type { UseBookingFormReturnType } from "@calcom/features/bookings/Booker/hooks/useBookingForm";
import { useBookerStore } from "@calcom/features/bookings/Booker/store";
import type { BookerState } from "@calcom/features/bookings/Booker/types";
import { getBookingResponsesSchemaWithOptionalChecks } from "@calcom/features/bookings/lib/getBookingResponsesSchema";
import type { BookerEvent } from "@calcom/features/bookings/types";
import { useEffect, useMemo, useState } from "react";

export const useSkipConfirmStep = (
  bookingForm: UseBookingFormReturnType["bookingForm"],
  bookerState: BookerState,
  isWeekView: boolean,
  bookingFields?: BookerEvent["bookingFields"],
  locations?: BookerEvent["locations"]
) => {
  const bookingFormValues = bookingForm.getValues();
  const effectiveBookingFields = useMemo(
    () => (bookingFields ? applyDentalBookingFieldPolicy(bookingFields) : undefined),
    [bookingFields]
  );

  const [canSkip, setCanSkip] = useState(false);
  const rescheduleUid = useBookerStore((state) => state.rescheduleUid);

  useEffect(() => {
    const checkSkipStep = async () => {
      if (!effectiveBookingFields || (locations && locations.length > 1)) {
        setCanSkip(false);
        return;
      }

      try {
        const responseSchema = getBookingResponsesSchemaWithOptionalChecks({
          bookingFields: effectiveBookingFields,
          view: rescheduleUid ? "reschedule" : "booking",
        });
        const responseSafeParse = await responseSchema.safeParseAsync(bookingFormValues.responses);

        setCanSkip(responseSafeParse.success);
      } catch (error) {
        setCanSkip(false);
      }
    };
    const isSkipConfirmStepSupported = !isWeekView;
    if (bookerState === "selecting_time" && isSkipConfirmStepSupported) {
      checkSkipStep();
    }
  }, [bookingFormValues, effectiveBookingFields, rescheduleUid, bookerState, isWeekView, locations]);

  return canSkip;
};
