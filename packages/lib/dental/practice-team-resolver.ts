import type { TeamLookupStore } from "../encryption/prisma-types";

export type PracticeTeamLookupInput = {
  teamId?: unknown;
  eventTypeId?: unknown;
  bookingId?: unknown;
};

/**
 * Resolves the practice (team) ID from an event type — the primary tenant key for encryption.
 */
export async function resolveTeamIdFromEventTypeId(
  prisma: TeamLookupStore,
  eventTypeId: number
): Promise<number | null> {
  if (!eventTypeId) {
    return null;
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { teamId: true },
  });

  return eventType?.teamId ?? null;
}

/**
 * Resolves the practice (team) ID via a booking's event type.
 */
export async function resolveTeamIdFromBookingId(
  prisma: TeamLookupStore,
  bookingId: number
): Promise<number | null> {
  if (!bookingId) {
    return null;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { eventType: { select: { teamId: true } } },
  });

  return booking?.eventType?.teamId ?? null;
}

/**
 * Resolves teamId from common tRPC / API input shapes (direct teamId, eventTypeId, or bookingId).
 */
export async function resolveTeamIdFromInput(
  prisma: TeamLookupStore,
  input: PracticeTeamLookupInput
): Promise<number | null> {
  if (typeof input.teamId === "number") {
    return input.teamId;
  }

  if (typeof input.eventTypeId === "number") {
    return resolveTeamIdFromEventTypeId(prisma, input.eventTypeId);
  }

  if (typeof input.bookingId === "number") {
    return resolveTeamIdFromBookingId(prisma, input.bookingId);
  }

  return null;
}
