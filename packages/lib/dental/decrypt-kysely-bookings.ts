import { prisma } from "@calcom/prisma";

import { decryptModelReadResult } from "../encryption/model-crypto";
import { getPracticeKeyResolver } from "../encryption/key-resolver";
import { isDentalComplianceMode } from "./compliance-config";
import { runWithDentalPracticeContext } from "./run-with-dental-context";

type DecryptableAttendee = Record<string, unknown> & { id?: number; email?: string };

export type DecryptableKyselyBooking = Record<string, unknown> & {
  eventType?: { teamId?: number | null } | null;
  attendees: DecryptableAttendee[];
};

async function decryptBookingRecord<T extends DecryptableKyselyBooking>(
  booking: T,
  resolver: ReturnType<typeof getPracticeKeyResolver>
): Promise<T> {
  const teamId = booking.eventType?.teamId;
  if (!teamId) {
    return booking;
  }

  return runWithDentalPracticeContext({ teamId, operation: "decrypt" }, async () => {
    const decryptedBooking = (await decryptModelReadResult(resolver, "Booking", booking)) as T;
    const decryptedAttendees = await Promise.all(
      booking.attendees.map((attendee) =>
        decryptModelReadResult(resolver, "Attendee", attendee).then(
          (decrypted) => decrypted as DecryptableAttendee
        )
      )
    );

    return { ...decryptedBooking, attendees: decryptedAttendees };
  });
}

/**
 * Decrypts booking list rows fetched via Kysely (bypasses Prisma field-encryption extension).
 */
export async function decryptKyselyBookings<T extends DecryptableKyselyBooking>(
  bookings: T[]
): Promise<T[]> {
  if (!isDentalComplianceMode() || bookings.length === 0) {
    return bookings;
  }

  const resolver = getPracticeKeyResolver(prisma);
  return Promise.all(bookings.map((booking) => decryptBookingRecord(booking, resolver)));
}
