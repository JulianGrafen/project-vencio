import { isDentalEncryptionEnabled } from "@calcom/lib/dental/feature-flags";

import { createEmailBlindIndex, createPhoneBlindIndex } from "./blind-index";
import {
  deserializeValueAfterDecryption,
  isPlainObject,
  serializeValueForEncryption,
  type WritableRecord,
} from "./crypto-utils";
import { getEncryptedFieldsForModel } from "./field-registry";
import {
  assertNoHealthDataInBookingResponses,
  assertNoHealthDataInRecord,
} from "./health-data-guard";
import type { PracticeKeyResolver } from "./key-resolver";
import {
  deserializeEncryptedField,
  extractTeamIdFromEncryptedValue,
  isEncryptedValue,
  serializeEncryptedField,
} from "./serialize-encrypted";
import type { ModelFieldRegistry } from "./types";
import { getTenantCryptoContext } from "./tenant-context";
import type { PracticeKeyStore, TeamLookupStore } from "./prisma-types";
import { resolveTeamIdFromWriteData } from "./team-id-resolver";

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
    if (isDentalEncryptionEnabled()) {
      throw new Error(
        `[dental-encryption] Cannot encrypt ${model} write: practice teamId could not be resolved. ` +
          `Ensure runWithDentalPracticeContext() wraps the operation.`
      );
    }
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
