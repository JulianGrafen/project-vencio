import logger from "@calcom/lib/logger";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import prisma from "@calcom/prisma";
import { Prisma } from "@calcom/prisma/client";
import type { baseEventTypeSelect } from "@calcom/prisma/selects";
import { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";

const log = logger.getSubLogger({ prefix: ["getEventTypesPublic"] });

export type EventTypesPublic = Awaited<ReturnType<typeof getEventTypesPublic>>;

export async function getEventTypesPublic(userId: number) {
  const eventTypesWithHidden = await getEventTypesWithHiddenFromDB(userId);

  const eventTypesRaw = eventTypesWithHidden.filter((evt) => !evt.hidden);
  const medicalProfilesByEventTypeId = await getMedicalProfilesByEventTypeId(
    eventTypesRaw.map((eventType) => eventType.id)
  );

  return eventTypesRaw.map((eventType) => ({
    ...eventType,
    metadata: EventTypeMetaDataSchema.parse(eventType.metadata || {}),
    descriptionAsSafeHTML: markdownToSafeHTML(eventType.description),
    medicalProfile: medicalProfilesByEventTypeId.get(eventType.id) ?? null,
  }));
}

/** Dental fork: category + insurance restrictions for the public booking page. */
async function getMedicalProfilesByEventTypeId(eventTypeIds: number[]) {
  if (eventTypeIds.length === 0) {
    return new Map<number, MedicalProfilePublic>();
  }

  try {
    const profiles = await prisma.eventTypeMedicalProfile.findMany({
      where: { eventTypeId: { in: eventTypeIds } },
      select: {
        eventTypeId: true,
        category: true,
        allowedInsuranceTypes: true,
        displayOrder: true,
        isEmergency: true,
      },
    });

    return new Map(profiles.map((profile) => [profile.eventTypeId, profile]));
  } catch (error) {
    // Fresh deploys may skip Prisma migrate on Vercel — public pages must still load.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      log.warn(
        "EventTypeMedicalProfile table missing — apply scripts/supabase/002_medical_recall_patch.sql. Serving event types without medical profiles."
      );
      return new Map();
    }

    throw error;
  }
}

type MedicalProfilePublic = Prisma.EventTypeMedicalProfileGetPayload<{
  select: {
    eventTypeId: true;
    category: true;
    allowedInsuranceTypes: true;
    displayOrder: true;
    isEmergency: true;
  };
}>;

type BaseEventType = Prisma.EventTypeGetPayload<{
  select: typeof baseEventTypeSelect;
}>;

type RawEventType = BaseEventType & {
  metadata: Record<string, any> | null;
};

const getEventTypesWithHiddenFromDB = async (userId: number) => {
  const eventTypes = await prisma.$queryRaw<RawEventType[]>`
    SELECT data."id", data."title", data."description", data."length", data."schedulingType"::text,
      data."recurringEvent", data."slug", data."hidden", data."price", data."currency",
      data."lockTimeZoneToggleOnBookingPage", data."lockedTimeZone", data."requiresConfirmation", data."requiresBookerEmailVerification",
      data."metadata", data."canSendCalVideoTranscriptionEmails"
      FROM (
        SELECT "EventType"."id", "EventType"."title", "EventType"."description",
          "EventType"."position", "EventType"."length", "EventType"."schedulingType"::text,
          "EventType"."recurringEvent", "EventType"."slug", "EventType"."hidden",
          "EventType"."price", "EventType"."currency",
          "EventType"."lockTimeZoneToggleOnBookingPage", "EventType"."lockedTimeZone", "EventType"."requiresConfirmation",
          "EventType"."requiresBookerEmailVerification", "EventType"."metadata",
          "EventType"."canSendCalVideoTranscriptionEmails", "EventType"."seatsPerTimeSlot"
        FROM "EventType"
        WHERE "EventType"."teamId" IS NULL AND "EventType"."userId" = ${userId}
        UNION
        SELECT "EventType"."id", "EventType"."title", "EventType"."description",
        "EventType"."position", "EventType"."length", "EventType"."schedulingType"::text,
        "EventType"."recurringEvent", "EventType"."slug", "EventType"."hidden",
        "EventType"."price", "EventType"."currency",
        "EventType"."lockTimeZoneToggleOnBookingPage", "EventType"."lockedTimeZone", "EventType"."requiresConfirmation",
        "EventType"."requiresBookerEmailVerification", "EventType"."metadata",
        "EventType"."canSendCalVideoTranscriptionEmails", "EventType"."seatsPerTimeSlot"
        FROM "EventType"
        WHERE "EventType"."teamId" IS NULL
        AND "EventType"."userId" IS NOT NULL
        AND "EventType"."id" IN (
          SELECT "uet1"."A" FROM "_user_eventtype" AS "uet1"
          INNER JOIN "users" AS "u1" ON "u1"."id" = "uet1"."B"
          WHERE "u1"."id" = ${userId} AND "uet1"."A" IS NOT NULL
      )
    ) data
    ORDER BY data."position" DESC, data."id" ASC`;

  // map and filter metadata, exclude eventType entirely when faulty metadata is found.
  // report error to exception so we don't lose the error.
  return eventTypes.reduce<typeof eventTypes>((eventTypes, eventType) => {
    const parsedMetadata = EventTypeMetaDataSchema.safeParse(eventType.metadata);
    if (!parsedMetadata.success) {
      log.error(parsedMetadata.error);
      return eventTypes;
    }
    eventTypes.push({
      ...eventType,
      metadata: parsedMetadata.data,
    });
    return eventTypes;
  }, []);
};
