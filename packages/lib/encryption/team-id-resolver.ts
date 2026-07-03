import { resolveTeamIdFromBookingId, resolveTeamIdFromEventTypeId } from "@calcom/lib/dental/practice-team-resolver";

import type { PracticeKeyStore, TeamLookupStore } from "./prisma-types";
import { isPlainObject, type WritableRecord } from "./crypto-utils";
import { getTenantCryptoContext } from "./tenant-context";

export async function resolveTeamIdFromWriteData(
  prisma: PracticeKeyStore & TeamLookupStore,
  model: string,
  data: WritableRecord
): Promise<number | null> {
  const contextTeamId = getTenantCryptoContext()?.teamId;
  if (contextTeamId) {
    return contextTeamId;
  }

  if (typeof data.teamId === "number") {
    return data.teamId;
  }

  if (model === "Booking") {
    const eventTypeId =
      typeof data.eventTypeId === "number"
        ? data.eventTypeId
        : isPlainObject(data.eventType) && isPlainObject(data.eventType.connect)
          ? (data.eventType.connect.id as number | undefined)
          : undefined;

    if (eventTypeId) {
      return resolveTeamIdFromEventTypeId(prisma, eventTypeId);
    }
  }

  if (model === "Attendee" || model === "BookingInternalNote") {
    const bookingId =
      typeof data.bookingId === "number"
        ? data.bookingId
        : isPlainObject(data.booking) && isPlainObject(data.booking.connect)
          ? (data.booking.connect.id as number | undefined)
          : undefined;

    if (bookingId) {
      return resolveTeamIdFromBookingId(prisma, bookingId);
    }
  }

  return null;
}
