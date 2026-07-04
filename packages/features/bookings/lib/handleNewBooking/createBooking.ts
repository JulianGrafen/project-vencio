import { sanitizeBookingTracking, isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import {
  prepareTokenBookingCreate,
  persistTokenBookingPayload,
  resolvePracticeBookingPublicKey,
} from "@calcom/lib/dental/token-booking";
import {
  shouldSyncPatientLastVisit,
  syncSmartFillPatientLastVisitFromBooking,
} from "@calcom/lib/dental/smart-fill/sync-patient-last-visit";
import { assertNoHealthDataInText } from "@calcom/lib/encryption/health-data-guard";
import dayjs from "@calcom/dayjs";
import { isPrismaObjOrUndefined } from "@calcom/lib/isPrismaObj";
import { withReporting } from "@calcom/lib/sentryWrapper";
import prisma from "@calcom/prisma";
import { Prisma } from "@calcom/prisma/client";
import type { CreationSource, InsuranceType } from "@calcom/prisma/enums";
import { BookingStatus } from "@calcom/prisma/enums";
import {
  PracticeTrialService,
  shouldCountBookingForTrial,
} from "@calcom/lib/dental/trial/trial.service";
import {
  assertInsuranceAllowedForEventType,
  extractInsuranceTypeFromResponses,
} from "@calcom/lib/dental/medical-categories/booking-insurance";
import {
  extractRecallRefFromMetadata,
  RecallConversionService,
} from "@calcom/lib/dental/recall/recall-conversion.service";
import logger from "@calcom/lib/logger";
import {
  bookingToPvsSyncInput,
  enqueueBookingPvsCancelIfEnabled,
  enqueueBookingPvsSyncIfEnabled,
} from "@calcom/lib/dental/pvs/enqueue-booking-pvs-sync";
import type { CalendarEvent } from "@calcom/types/Calendar";
import type short from "short-uuid";
import type { TgetBookingDataSchema } from "../getBookingDataSchema";
import type { AwaitedBookingData, EventTypeId } from "./getBookingData";
import type { NewBookingEventType } from "./getEventTypesFromDB";
import type { LoadedUsers } from "./loadUsers";
import type { OriginalRescheduledBooking } from "./originalRescheduledBookingUtils";
import type { PaymentAppData, Tracking } from "./types";

type ReqBodyWithEnd = TgetBookingDataSchema & { end: string };

type CreateBookingParams = {
  uid: short.SUUID;
  rescheduledBy: string | undefined;
  reqBody: {
    user: ReqBodyWithEnd["user"];
    metadata: ReqBodyWithEnd["metadata"];
    recurringEventId: ReqBodyWithEnd["recurringEventId"];
    treatmentResourceId?: string;
  };
  eventType: {
    eventTypeData: NewBookingEventType;
    id: EventTypeId;
    slug: AwaitedBookingData["eventTypeSlug"];
    organizerUser: LoadedUsers[number] & {
      isFixed?: boolean;
      metadata?: Prisma.JsonValue;
    };
    isConfirmedByDefault: boolean;
    paymentAppData: PaymentAppData;
  };
  input: {
    bookerEmail: AwaitedBookingData["email"];
    rescheduleReason: AwaitedBookingData["rescheduleReason"];
    smsReminderNumber: AwaitedBookingData["smsReminderNumber"];
    responses: ReqBodyWithEnd["responses"] | null;
  };
  evt: CalendarEvent;
  originalRescheduledBooking: OriginalRescheduledBooking;
  creationSource?: CreationSource;
  tracking?: Tracking;
};

function updateEventDetails(
  evt: CalendarEvent,
  originalRescheduledBooking: OriginalRescheduledBooking | null
) {
  if (originalRescheduledBooking) {
    evt.description = originalRescheduledBooking?.description || evt.description;
    evt.location = evt.location || originalRescheduledBooking?.location;
  }
}

// Define the function with underscore prefix
const _createBooking = async ({
  uid,
  reqBody,
  eventType,
  input,
  evt,
  originalRescheduledBooking,
  rescheduledBy,
  creationSource,
  tracking,
}: CreateBookingParams & { rescheduledBy: string | undefined }) => {
  if (evt.additionalNotes) {
    assertNoHealthDataInText("notes", evt.additionalNotes);
  }

  const sanitizedTracking = sanitizeBookingTracking(tracking);

  const insuranceType = extractInsuranceTypeFromResponses(input.responses);
  if (insuranceType && eventType.id) {
    await assertInsuranceAllowedForEventType(prisma, Number(eventType.id), insuranceType);
  }

  updateEventDetails(evt, originalRescheduledBooking);

  const bookingAndAssociatedData = buildNewBookingData({
    uid,
    rescheduledBy,
    reqBody,
    eventType,
    input,
    evt,
    originalRescheduledBooking,
    creationSource,
    tracking: sanitizedTracking,
    insuranceType,
  });

  const booking = await saveBooking(
    bookingAndAssociatedData,
    originalRescheduledBooking,
    eventType.paymentAppData,
    eventType.organizerUser,
    {
      teamId: eventType.eventTypeData?.teamId ?? null,
      eventTypeId: eventType.id ? Number(eventType.id) : null,
      bookerEmail: input.bookerEmail,
      smsReminderNumber: input.smsReminderNumber,
      isAccepted: eventType.isConfirmedByDefault,
    }
  );

  await attributeBookingToRecall(reqBody.metadata, booking.uid);

  return booking;
};

/** Recall conversion KPI — attribution failures must never block the booking. */
async function attributeBookingToRecall(metadata: unknown, bookingUid: string): Promise<void> {
  const recallRef = extractRecallRefFromMetadata(metadata);
  if (!recallRef) {
    return;
  }

  try {
    await new RecallConversionService(prisma).attributeBooking(recallRef, bookingUid);
  } catch (error) {
    logger.getSubLogger({ prefix: ["recall-conversion"] }).error("Recall attribution failed", error);
  }
}

export const createBooking = withReporting(_createBooking, "createBooking");

async function saveBooking(
  bookingAndAssociatedData: ReturnType<typeof buildNewBookingData>,
  originalRescheduledBooking: OriginalRescheduledBooking,
  paymentAppData: PaymentAppData,
  organizerUser: CreateBookingParams["eventType"]["organizerUser"],
  pvsSyncContext?: {
    teamId: number | null;
    eventTypeId: number | null;
    bookerEmail: string;
    smsReminderNumber?: string | null;
    isAccepted: boolean;
  }
) {
  const { newBookingData, originalBookingUpdateDataForCancellation } = bookingAndAssociatedData;
  const createBookingObj = {
    include: {
      user: {
        select: {
          uuid: true,
          email: true,
          name: true,
          timeZone: true,
          username: true,
          isPlatformManaged: true,
        },
      },
      attendees: true,
      payment: true,
      references: true,
    },
    data: newBookingData,
  };

  if (originalRescheduledBooking?.paid && originalRescheduledBooking?.payment) {
    const bookingPayment = originalRescheduledBooking.payment.find((payment) => payment.success);
    if (bookingPayment) {
      createBookingObj.data.payment = { connect: { id: bookingPayment.id } };
    }
  }

  if (typeof paymentAppData.price === "number" && paymentAppData.price > 0) {
    await prisma.credential.findFirstOrThrow({
      where: {
        appId: paymentAppData.appId,
        ...(paymentAppData.credentialId ? { id: paymentAppData.credentialId } : { userId: organizerUser.id }),
      },
      select: { id: true },
    });
  }

  let bookingCreateData = createBookingObj.data;
  let tokenBookingPayloadRow: Awaited<ReturnType<typeof prepareTokenBookingCreate>>["tokenBookingPayload"] =
    null;

  if (isDentalComplianceMode() && pvsSyncContext?.teamId) {
    const practicePublicKey = await resolvePracticeBookingPublicKey(pvsSyncContext.teamId);
    const prepared = prepareTokenBookingCreate(bookingCreateData, {
      teamId: pvsSyncContext.teamId,
      bookingUid: String(bookingCreateData.uid),
      practicePublicKey,
    });
    bookingCreateData = prepared.bookingData;
    tokenBookingPayloadRow = prepared.tokenBookingPayload;
  }

  return prisma.$transaction(async (tx) => {
    if (originalBookingUpdateDataForCancellation) {
      await tx.booking.update(originalBookingUpdateDataForCancellation);
    }

    const booking = await tx.booking.create({
      ...createBookingObj,
      data: bookingCreateData,
    });

    if (tokenBookingPayloadRow) {
      await persistTokenBookingPayload(tx, booking.uid, tokenBookingPayloadRow);
    }

    if (
      pvsSyncContext?.teamId &&
      shouldSyncPatientLastVisit(booking.status) &&
      pvsSyncContext.bookerEmail
    ) {
      await syncSmartFillPatientLastVisitFromBooking(tx, {
        teamId: pvsSyncContext.teamId,
        bookerEmail: pvsSyncContext.bookerEmail,
        startTime: booking.startTime,
      });
    }

    if (pvsSyncContext?.teamId && shouldCountBookingForTrial(booking.status)) {
      await new PracticeTrialService(tx).recordAcceptedBooking(pvsSyncContext.teamId);
    }

    if (pvsSyncContext?.teamId && pvsSyncContext.isAccepted) {
      const pvsInput = bookingToPvsSyncInput(
        pvsSyncContext.teamId,
        {
          uid: booking.uid,
          title: booking.title,
          startTime: booking.startTime,
          endTime: booking.endTime,
          eventTypeId: pvsSyncContext.eventTypeId,
          attendees: booking.attendees,
        },
        {
          bookerEmail: pvsSyncContext.bookerEmail,
          fallbackPhone: pvsSyncContext.smsReminderNumber,
          source: "booker",
        }
      );

      if (pvsInput) {
        await enqueueBookingPvsSyncIfEnabled(tx, pvsInput);
      }
    }

    if (
      pvsSyncContext?.teamId &&
      originalRescheduledBooking?.uid &&
      originalBookingUpdateDataForCancellation
    ) {
      const cancelInput = bookingToPvsSyncInput(
        pvsSyncContext.teamId,
        {
          uid: originalRescheduledBooking.uid,
          title: originalRescheduledBooking.title ?? booking.title,
          startTime: originalRescheduledBooking.startTime,
          endTime: originalRescheduledBooking.endTime,
          eventTypeId: pvsSyncContext.eventTypeId,
          attendees: originalRescheduledBooking.attendees ?? [],
        },
        {
          bookerEmail: pvsSyncContext.bookerEmail,
          cancellationReason: createBookingObj.data.cancellationReason as string | undefined,
          rescheduledToBookingUid: booking.uid,
          source: "booker",
        }
      );

      if (cancelInput) {
        await enqueueBookingPvsCancelIfEnabled(tx, cancelInput);
      }
    }

    return { ...booking, userUuid: booking.user?.uuid ?? null };
  });
}

function getEventTypeRel(eventTypeId: EventTypeId) {
  return eventTypeId ? { connect: { id: eventTypeId } } : {};
}

function getAttendeesData(evt: Pick<CalendarEvent, "attendees" | "team">) {
  //if attendee is team member, it should fetch their locale not booker's locale
  //perhaps make email fetch request to see if his locale is stored, else
  const teamMembers = evt?.team?.members ?? [];

  return evt.attendees.concat(teamMembers).map((attendee) => ({
    name: attendee.name,
    email: attendee.email,
    timeZone: attendee.timeZone,
    locale: attendee.language.locale,
    phoneNumber: attendee.phoneNumber,
  }));
}

function buildNewBookingData(params: CreateBookingParams & { insuranceType: InsuranceType | null }) {
  const {
    uid,
    evt,
    reqBody,
    eventType,
    input,
    originalRescheduledBooking,
    rescheduledBy,
    creationSource,
    tracking,
    insuranceType,
  } = params;

  const attendeesData = getAttendeesData(evt);
  const eventTypeRel = getEventTypeRel(eventType.id);
  const newBookingData: Prisma.BookingCreateInput = {
    uid,
    userPrimaryEmail: evt.organizer.email,
    responses: input.responses === null || evt.seatsPerTimeSlot ? Prisma.JsonNull : input.responses,
    title: evt.title,
    startTime: dayjs.utc(evt.startTime).toDate(),
    endTime: dayjs.utc(evt.endTime).toDate(),
    description: evt.seatsPerTimeSlot ? null : evt.additionalNotes,
    customInputs: isPrismaObjOrUndefined(evt.customInputs),
    status: eventType.isConfirmedByDefault ? BookingStatus.ACCEPTED : BookingStatus.PENDING,
    oneTimePassword: evt.oneTimePassword,
    location: evt.location,
    eventType: eventTypeRel,
    smsReminderNumber: input.smsReminderNumber,
    metadata: reqBody.metadata,
    attendees: {
      createMany: {
        data: attendeesData,
      },
    },
    dynamicEventSlugRef: !eventType.id ? eventType.slug : null,
    dynamicGroupSlugRef: !eventType.id ? (reqBody.user as string).toLowerCase() : null,
    iCalUID: evt.iCalUID ?? "",
    iCalSequence: originalRescheduledBooking ? evt.iCalSequence || 1 : 0,
    user: {
      connect: {
        id: eventType.organizerUser.id,
      },
    },
    destinationCalendar:
      evt.destinationCalendar && evt.destinationCalendar.length > 0
        ? {
            connect: { id: evt.destinationCalendar[0].id },
          }
        : undefined,
    creationSource,
    tracking: tracking ? { create: tracking } : undefined,
    insuranceType,
    ...(reqBody.treatmentResourceId
      ? {
          resources: {
            create: {
              resourceId: reqBody.treatmentResourceId,
            },
          },
        }
      : {}),
  };

  if (reqBody.recurringEventId) {
    newBookingData.recurringEventId = reqBody.recurringEventId;
  }

  let originalBookingUpdateDataForCancellation: Prisma.BookingUpdateArgs | undefined;

  if (originalRescheduledBooking) {
    newBookingData.metadata = {
      ...(typeof originalRescheduledBooking.metadata === "object" && originalRescheduledBooking.metadata),
      ...reqBody.metadata,
    };
    newBookingData.paid = originalRescheduledBooking.paid;
    newBookingData.fromReschedule = originalRescheduledBooking.uid;
    if (originalRescheduledBooking.uid) {
      newBookingData.cancellationReason = input.rescheduleReason;
    }
    // Reschedule logic with booking with seats
    if (
      newBookingData.attendees?.createMany?.data &&
      eventType?.eventTypeData?.seatsPerTimeSlot &&
      input.bookerEmail
    ) {
      newBookingData.attendees.createMany.data = attendeesData.filter(
        (attendee) => attendee.email === input.bookerEmail
      );
    }

    if (originalRescheduledBooking.recurringEventId) {
      newBookingData.recurringEventId = originalRescheduledBooking.recurringEventId;
    }

    if (!evt.seatsPerTimeSlot && originalRescheduledBooking?.uid) {
      originalBookingUpdateDataForCancellation = {
        where: {
          id: originalRescheduledBooking.id,
        },
        data: {
          rescheduled: true,
          status: BookingStatus.CANCELLED,
          rescheduledBy: rescheduledBy,
        },
      };
    }
  }

  return {
    newBookingData,
    originalBookingUpdateDataForCancellation,
  };
}

export type Booking = Awaited<ReturnType<typeof createBooking>>;
