import crypto from "node:crypto";

import { assertValidDek } from "./crypto-gcm";

const BLIND_INDEX_SALT = "dental-blind-index-v1";

export function normalizeEmailForIndex(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhoneForIndex(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function deriveBlindIndexKey(dek: Buffer): Buffer {
  assertValidDek(dek);
  return crypto.createHmac("sha256", dek).update(BLIND_INDEX_SALT).digest();
}

export function createBlindIndex(value: string, dek: Buffer): string {
  const indexKey = deriveBlindIndexKey(dek);
  return crypto.createHmac("sha256", indexKey).update(value).digest("hex");
}

export function createEmailBlindIndex(email: string, dek: Buffer): string {
  return createBlindIndex(normalizeEmailForIndex(email), dek);
}

export function createPhoneBlindIndex(phone: string, dek: Buffer): string {
  return createBlindIndex(normalizePhoneForIndex(phone), dek);
}
