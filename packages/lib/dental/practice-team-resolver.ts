import type { TeamLookupStore } from "../encryption/prisma-types";

export type PracticeTeamLookupInput = {
  teamId?: unknown;
  eventTypeId?: unknown;
  bookingId?: unknown;
};

type EventTypeTeamRecord = {
  teamId: number | null;
  parentId?: number | null;
};

type EventTypeWithTeamRecord = {
  team?: { id: number | null } | null;
  teamId?: number | null;
  parentId?: number | null;
};

/**
 * Resolves the practice (team) ID from an event type — the primary tenant key for encryption.
 * Handles managed event types via parentId (same logic as getTeamIdFromEventType).
 */
export async function resolveTeamIdFromEventTypeId(
  prisma: TeamLookupStore,
  eventTypeId: number
): Promise<number | null> {
  if (!eventTypeId) {
    return null;
  }

  const eventType = (await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { teamId: true, parentId: true },
  })) as EventTypeTeamRecord | null;

  if (!eventType) {
    return null;
  }

  if (eventType.teamId) {
    return eventType.teamId;
  }

  if (eventType.parentId) {
    return resolveTeamIdFromEventTypeId(prisma, eventType.parentId);
  }

  return null;
}

/**
 * Resolves teamId from an already-loaded event type record (e.g. with nested team).
 */
export async function resolveTeamIdFromEventTypeRecord(
  prisma: TeamLookupStore,
  eventType: EventTypeWithTeamRecord | null | undefined
): Promise<number | null> {
  if (!eventType) {
    return null;
  }

  if (eventType.team?.id) {
    return eventType.team.id;
  }

  if (eventType.teamId) {
    return eventType.teamId;
  }

  if (eventType.parentId) {
    return resolveTeamIdFromEventTypeId(prisma, eventType.parentId);
  }

  return null;
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
    select: { eventType: { select: { teamId: true, parentId: true } } },
  });

  if (!booking?.eventType) {
    return null;
  }

  return resolveTeamIdFromEventTypeRecord(prisma, booking.eventType);
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
