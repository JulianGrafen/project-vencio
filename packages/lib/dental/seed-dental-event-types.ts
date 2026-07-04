import type { PrismaClient } from "@calcom/prisma/client";

import { buildDentalInPersonLocation } from "./booking-location-policy";
import {
  buildDentalEventTypeCreatePayload,
  DENTAL_DEFAULT_EVENT_TYPES,
} from "./default-event-types";

const DENTAL_EVENT_TYPE_TITLES_DE: Record<string, string> = {
  dental_event_kontrolle: "Kontrolluntersuchung (15 Min)",
  dental_event_pzr: "Professionelle Zahnreinigung (45 Min)",
  dental_event_schmerz: "Akuttermin bei Schmerzen (30 Min)",
  dental_event_behandlung: "Behandlungstermin vereinbaren (30 Min)",
};

export function getDentalEventTypeTitle(titleKey: string, locale = "de"): string {
  if (locale.startsWith("de")) {
    return DENTAL_EVENT_TYPE_TITLES_DE[titleKey] ?? titleKey;
  }
  return DENTAL_EVENT_TYPE_TITLES_DE[titleKey] ?? titleKey;
}

/**
 * Sets all user-owned event types to in-practice location with the clinic address.
 */
export async function syncDentalEventTypeLocationsForUser(
  prisma: PrismaClient,
  userId: number,
  practiceAddress: string
): Promise<number> {
  const location = buildDentalInPersonLocation(practiceAddress);
  const eventTypes = await prisma.eventType.findMany({
    where: { userId },
    select: { id: true },
  });

  if (eventTypes.length === 0) {
    return 0;
  }

  await prisma.eventType.updateMany({
    where: { userId },
    data: {
      locations: [location],
    },
  });

  return eventTypes.length;
}

/**
 * Seeds standard dental event types for a user when none exist.
 * Safe to call after onboarding — skips if user already has event types.
 */
export async function seedDentalEventTypesForUser(
  prisma: PrismaClient,
  userId: number,
  options?: { locale?: string; practiceAddress?: string }
): Promise<number> {
  const existingCount = await prisma.eventType.count({
    where: { userId },
  });

  if (existingCount > 0) {
    return 0;
  }

  const locale = options?.locale ?? "de";
  let created = 0;

  for (const definition of DENTAL_DEFAULT_EVENT_TYPES) {
    const title = getDentalEventTypeTitle(definition.titleKey, locale);
    const payload = buildDentalEventTypeCreatePayload(definition, title, options?.practiceAddress);

    await prisma.eventType.create({
      data: {
        ...payload,
        users: { connect: { id: userId } },
        userId,
      },
    });
    created += 1;
  }

  return created;
}
