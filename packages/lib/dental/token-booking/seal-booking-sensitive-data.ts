import { Prisma } from "@calcom/prisma/client";

import {
  createBookingReferenceHash,
  encryptWithPracticePublicKey,
} from "../crypto/hybrid-public-key-crypto";
import type { PracticeBookingPublicKey } from "./practice-public-key.service";
import {
  GENERIC_DENTAL_BOOKING_TITLE,
  TOKEN_BOOKING_METADATA_KEY,
  TOKEN_BOOKING_PAYLOAD_VERSION,
  TOKEN_BOOKING_REFERENCE_KEY,
  TOKEN_BOOKING_SEAL_KEY,
  TOKEN_BOOKING_VERIFICATION_RESPONSE_KEYS,
  tokenBookingSensitivePayloadSchema,
  type TokenBookingSealMetadata,
  type TokenBookingSensitivePayload,
} from "./types";

export type SealBookingSensitiveDataInput = {
  teamId: number;
  bookingUid: string;
  startTimeIso: string;
  title: string;
  description?: string | null;
  location?: string | null;
  responses?: Record<string, unknown> | null;
  customInputs?: Prisma.JsonValue | null;
  attendees: Array<{ name: string; email: string; phoneNumber?: string | null }>;
  practicePublicKey: PracticeBookingPublicKey;
};

export type SealedBookingStoragePatch = {
  title: string;
  description: string | null;
  location: string | null;
  responses: Record<string, unknown> | null;
  customInputs: Prisma.JsonValue | null;
  metadata: Record<string, unknown>;
  attendees: Array<{ name: string; email: string; phoneNumber?: string | null }>;
};

function toJsonValue(
  value: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | null | undefined
): Prisma.JsonValue | null | undefined {
  if (value === null || value === undefined) {
    return value ?? null;
  }
  if (value === Prisma.DbNull || value === Prisma.JsonNull) {
    return null;
  }
  return value as Prisma.JsonValue;
}

function pickVerificationResponses(
  responses: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!responses) {
    return null;
  }

  const minimized: Record<string, unknown> = {};
  for (const key of Object.keys(responses)) {
    if (TOKEN_BOOKING_VERIFICATION_RESPONSE_KEYS.has(key)) {
      minimized[key] = responses[key];
    }
  }

  return Object.keys(minimized).length > 0 ? minimized : null;
}

function buildSensitivePayload(input: SealBookingSensitiveDataInput): TokenBookingSensitivePayload {
  return tokenBookingSensitivePayloadSchema.parse({
    v: TOKEN_BOOKING_PAYLOAD_VERSION,
    treatmentLabel: input.title,
    bookerDisplayName: input.attendees[0]?.name,
    additionalNotes: input.description ?? undefined,
    customInputs: input.customInputs ?? undefined,
    responses: input.responses ?? undefined,
    attendeeNames: input.attendees.map((a) => a.name).filter(Boolean),
    locationDetail: input.location ?? undefined,
  });
}

/**
 * Token-Booking pattern: seal Art. 9-relevant data asymmetrically before Prisma insert.
 * Database retains slot reference + verification contact data only; cloud cannot decrypt the payload.
 */
export function sealBookingSensitiveData(
  input: SealBookingSensitiveDataInput
): SealedBookingStoragePatch {
  const sensitivePayload = buildSensitivePayload(input);
  const encryptedPayload = encryptWithPracticePublicKey(
    JSON.stringify(sensitivePayload),
    input.practicePublicKey.publicKeyPem,
    input.practicePublicKey.teamId,
    input.practicePublicKey.keyVersion
  );

  const sealMeta: TokenBookingSealMetadata = {
    version: TOKEN_BOOKING_PAYLOAD_VERSION,
    algorithm: "RSA-OAEP-AES-256-GCM",
    teamId: input.practicePublicKey.teamId,
    keyVersion: input.practicePublicKey.keyVersion,
    sealedAt: new Date().toISOString(),
  };

  const bookingReferenceHash = createBookingReferenceHash({
    teamId: input.teamId,
    uid: input.bookingUid,
    startTimeIso: input.startTimeIso,
  });

  return {
    title: GENERIC_DENTAL_BOOKING_TITLE,
    description: null,
    location: "Praxis-Besuch",
    responses: pickVerificationResponses(input.responses),
    customInputs: null,
    metadata: {
      [TOKEN_BOOKING_METADATA_KEY]: encryptedPayload,
      [TOKEN_BOOKING_REFERENCE_KEY]: bookingReferenceHash,
      [TOKEN_BOOKING_SEAL_KEY]: sealMeta,
    },
    attendees: input.attendees.map((attendee) => ({
      email: attendee.email,
      phoneNumber: attendee.phoneNumber,
      name: "Patient",
    })),
  };
}

/**
 * Applies data-minimization even when no practice public key is configured yet.
 * Plaintext treatment labels and form responses are stripped; envelope encryption still applies.
 */
export function minimizeBookingSensitiveData(
  input: Omit<SealBookingSensitiveDataInput, "practicePublicKey">
): SealedBookingStoragePatch {
  const bookingReferenceHash = createBookingReferenceHash({
    teamId: input.teamId,
    uid: input.bookingUid,
    startTimeIso: input.startTimeIso,
  });

  return {
    title: GENERIC_DENTAL_BOOKING_TITLE,
    description: null,
    location: "Praxis-Besuch",
    responses: pickVerificationResponses(input.responses),
    customInputs: null,
    metadata: {
      [TOKEN_BOOKING_REFERENCE_KEY]: bookingReferenceHash,
      [TOKEN_BOOKING_SEAL_KEY]: {
        version: TOKEN_BOOKING_PAYLOAD_VERSION,
        algorithm: "data-minimization-only",
        teamId: input.teamId,
        sealedAt: new Date().toISOString(),
      },
    },
    attendees: input.attendees.map((attendee) => ({
      email: attendee.email,
      phoneNumber: attendee.phoneNumber,
      name: "Patient",
    })),
  };
}

export function applyTokenBookingSealToCreateInput(
  newBookingData: Prisma.BookingCreateInput,
  params: {
    teamId: number | null;
    bookingUid: string;
    practicePublicKey: PracticeBookingPublicKey | null;
  }
): Prisma.BookingCreateInput {
  if (!params.teamId) {
    return newBookingData;
  }

  const attendeesCreateMany = newBookingData.attendees?.createMany?.data;
  const attendees = Array.isArray(attendeesCreateMany)
    ? attendeesCreateMany.map((a) => ({
        name: String(a.name ?? ""),
        email: String(a.email ?? ""),
        phoneNumber: a.phoneNumber ? String(a.phoneNumber) : null,
        timeZone: a.timeZone ? String(a.timeZone) : "Europe/Berlin",
        locale: a.locale ? String(a.locale) : "de",
      }))
    : [];

  const baseInput = {
    teamId: params.teamId,
    bookingUid: params.bookingUid,
    startTimeIso: newBookingData.startTime
      ? new Date(newBookingData.startTime as Date).toISOString()
      : new Date().toISOString(),
    title: String(newBookingData.title ?? ""),
    description: newBookingData.description ? String(newBookingData.description) : null,
    location: newBookingData.location ? String(newBookingData.location) : null,
    responses:
      newBookingData.responses && typeof newBookingData.responses === "object"
        ? (newBookingData.responses as Record<string, unknown>)
        : null,
    customInputs: toJsonValue(newBookingData.customInputs),
    attendees,
  };

  const patch = params.practicePublicKey
    ? sealBookingSensitiveData({ ...baseInput, practicePublicKey: params.practicePublicKey })
    : minimizeBookingSensitiveData(baseInput);

  const existingMetadata =
    newBookingData.metadata && typeof newBookingData.metadata === "object"
      ? (newBookingData.metadata as Record<string, unknown>)
      : {};

  return {
    ...newBookingData,
    title: patch.title,
    description: patch.description,
    location: patch.location,
    responses: (patch.responses ?? undefined) as Prisma.InputJsonValue | undefined,
    customInputs: (patch.customInputs ?? undefined) as Prisma.InputJsonValue | undefined,
    metadata: {
      ...existingMetadata,
      ...patch.metadata,
    } as Prisma.InputJsonValue,
    attendees: newBookingData.attendees
      ? {
          ...newBookingData.attendees,
          createMany: {
            data: attendees.map((original, index) => {
              const sealed = patch.attendees[index] ?? patch.attendees[0];
              return {
                name: sealed?.name ?? "Patient",
                email: sealed?.email ?? original.email,
                phoneNumber: sealed?.phoneNumber ?? original.phoneNumber,
                timeZone: original.timeZone,
                locale: original.locale,
              };
            }),
          },
        }
      : undefined,
  };
}
