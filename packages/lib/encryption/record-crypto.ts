import type { PracticeKeyStore, TeamLookupStore } from "./prisma-types";
import { createEmailBlindIndex, createPhoneBlindIndex } from "./blind-index";
import { generateDek } from "./crypto-gcm";
import type { ModelFieldRegistry } from "./types";
import { getEncryptedFieldsForModel } from "./field-registry";
import {
  assertNoHealthDataInBookingResponses,
  assertNoHealthDataInRecord,
} from "./health-data-guard";
import type { PracticeKeyResolver } from "./key-resolver";
import { deserializeEncryptedField, isEncryptedValue, serializeEncryptedField } from "./serialize-encrypted";
import { getTenantCryptoContext } from "./tenant-context";

type WritableRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is WritableRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function serializeValueForEncryption(value: unknown, json?: boolean): string {
  if (json) {
    return JSON.stringify(value ?? null);
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function deserializeValueAfterDecryption(raw: string, json?: boolean): unknown {
  if (!json) {
    return raw;
  }
  return JSON.parse(raw) as unknown;
}

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
      const eventType = await prisma.eventType.findUnique({
        where: { id: eventTypeId },
        select: { teamId: true },
      });
      return eventType?.teamId ?? null;
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
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { eventType: { select: { teamId: true } } },
      });
      return booking?.eventType?.teamId ?? null;
    }
  }

  return null;
}

async function applyHealthDataGuard(model: string, data: WritableRecord): Promise<void> {
  if (model === "Booking") {
    assertNoHealthDataInRecord(data);
    if (isPlainObject(data.responses)) {
      assertNoHealthDataInBookingResponses(data.responses);
    }
  }

  if (model === "BookingInternalNote" && typeof data.text === "string") {
    assertNoHealthDataInRecord({ text: data.text });
  }
}

async function encryptFieldValue(
  fieldName: string,
  value: unknown,
  config: ModelFieldRegistry[string],
  keyMaterial: { teamId: number; keyVersion: number; dek: Buffer }
): Promise<{ encrypted: unknown; blindIndexUpdates: WritableRecord }> {
  const blindIndexUpdates: WritableRecord = {};

  if (value === null || value === undefined) {
    return { encrypted: value, blindIndexUpdates };
  }

  if (typeof value === "string" && isEncryptedValue(value)) {
    return { encrypted: value, blindIndexUpdates };
  }

  const plaintext = serializeValueForEncryption(value, config.json);
  const encrypted = serializeEncryptedField(plaintext, keyMaterial.dek, keyMaterial.teamId, keyMaterial.keyVersion);

  if (config.blindIndex && typeof value === "string") {
    const blindIndexField = config.blindIndexField ?? `${fieldName}BlindIndex`;
    if (fieldName === "email" || fieldName === "userPrimaryEmail") {
      blindIndexUpdates[blindIndexField] = createEmailBlindIndex(value, keyMaterial.dek);
    } else if (fieldName === "phoneNumber" || fieldName === "smsReminderNumber") {
      blindIndexUpdates[blindIndexField] = createPhoneBlindIndex(value, keyMaterial.dek);
    }
  }

  return { encrypted, blindIndexUpdates };
}

export async function encryptModelWriteData(
  prisma: PracticeKeyStore & TeamLookupStore,
  keyResolver: PracticeKeyResolver,
  model: string,
  data: WritableRecord
): Promise<WritableRecord> {
  const registry = getEncryptedFieldsForModel(model);
  if (!registry) {
    return data;
  }

  await applyHealthDataGuard(model, data);

  const teamId = await resolveTeamIdFromWriteData(prisma, model, data);
  if (!teamId) {
    return data;
  }

  const keyMaterial = await keyResolver.resolve(teamId);
  const output: WritableRecord = { ...data };

  for (const [fieldName, config] of Object.entries(registry)) {
    if (!(fieldName in output)) {
      continue;
    }

    const { encrypted, blindIndexUpdates } = await encryptFieldValue(
      fieldName,
      output[fieldName],
      config,
      keyMaterial
    );
    output[fieldName] = encrypted;
    Object.assign(output, blindIndexUpdates);
  }

  return output;
}

export async function decryptModelReadResult(
  keyResolver: PracticeKeyResolver,
  model: string,
  record: unknown
): Promise<unknown> {
  if (!isPlainObject(record)) {
    return record;
  }

  const registry = getEncryptedFieldsForModel(model);
  if (!registry) {
    return record;
  }

  const output: WritableRecord = { ...record };

  for (const [fieldName, config] of Object.entries(registry)) {
    const value = output[fieldName];
    if (typeof value !== "string" || !isEncryptedValue(value)) {
      continue;
    }

    const teamId = getTenantCryptoContext()?.teamId ?? extractTeamIdFromEncryptedValue(value);
    if (!teamId) {
      continue;
    }

    const keyMaterial = await keyResolver.resolve(teamId);
    const plaintext = deserializeEncryptedField(value, keyMaterial.dek);
    output[fieldName] = deserializeValueAfterDecryption(plaintext, config.json);
  }

  return output;
}

function extractTeamIdFromEncryptedValue(value: string): number | null {
  const prefix = "enc:v1:";
  if (!value.startsWith(prefix)) {
    return null;
  }
  const rest = value.slice(prefix.length);
  const teamIdPart = rest.split(":")[0];
  const teamId = Number(teamIdPart);
  return Number.isNaN(teamId) ? null : teamId;
}

export async function encryptNestedWrites(
  prisma: PracticeKeyStore & TeamLookupStore,
  keyResolver: PracticeKeyResolver,
  data: WritableRecord
): Promise<WritableRecord> {
  const output: WritableRecord = { ...data };

  if (isPlainObject(output.attendees) && Array.isArray(output.attendees.create)) {
    output.attendees = {
      ...output.attendees,
      create: await Promise.all(
        output.attendees.create.map((entry) =>
          encryptModelWriteData(prisma, keyResolver, "Attendee", entry as WritableRecord)
        )
      ),
    };
  }

  if (isPlainObject(output.internalNote) && Array.isArray(output.internalNote.create)) {
    output.internalNote = {
      ...output.internalNote,
      create: await Promise.all(
        output.internalNote.create.map((entry) =>
          encryptModelWriteData(prisma, keyResolver, "BookingInternalNote", entry as WritableRecord)
        )
      ),
    };
  }

  return output;
}

// Re-export generateDek for key-resolver provisioning without circular deps at module load
export { generateDek };
