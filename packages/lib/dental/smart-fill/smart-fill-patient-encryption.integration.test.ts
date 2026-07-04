import { beforeEach, describe, expect, it, vi } from "vitest";

import { decryptModelReadResult } from "../../encryption/model-crypto";
import { PracticeKeyResolver } from "../../encryption/key-resolver";
import { encryptModelWriteData } from "../../encryption/record-crypto";
import { runWithTenantContextAsync } from "../../encryption/tenant-context";
import { isEncryptedValue } from "../../encryption/serialize-encrypted";
import { resolveSmartFillPatientPhoneLookupKey } from "./smart-fill-patient-phone-index";

const TEAM_ID = 7;

const mockKms = {
  wrapDek: vi.fn(async (dek: Buffer) => `wrapped:${dek.toString("hex").slice(0, 8)}`),
  unwrapDek: vi.fn(async (encrypted: string) => {
    const hex = encrypted.replace("wrapped:", "");
    return Buffer.alloc(32, hex);
  }),
  getProviderKeyId: vi.fn(() => "test-kms"),
};

const mockPrisma = {
  practiceEncryptionKey: {
    findUnique: vi.fn(async () => null),
    upsert: vi.fn(async ({ create }: { create: { encryptedDek: string; keyVersion: number } }) => ({
      encryptedDek: create.encryptedDek,
      keyVersion: create.keyVersion,
      isActive: true,
    })),
  },
  eventType: {
    findUnique: vi.fn(),
  },
  booking: {
    findUnique: vi.fn(),
  },
};

function buildSmartFillPatientWritePayload() {
  return {
    teamId: TEAM_ID,
    name: "Max Mustermann",
    email: "max@example.com",
    phoneNumber: "+491701234567",
    phoneBlindIndex: resolveSmartFillPatientPhoneLookupKey("+491701234567"),
    waitlistEnabled: true,
    recallEnabled: true,
    priorityScore: 0,
  };
}

describe("SmartFillPatient encryption round-trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    process.env.DENTAL_KMS_MASTER_KEY = "12345678901234567890123456789012";
  });

  it("encrypts PII fields with enc:v1 ciphertext and phone blind index", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);
    const payload = buildSmartFillPatientWritePayload();

    const encrypted = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "encrypt" }, async () =>
      encryptModelWriteData(mockPrisma as never, keyResolver, "SmartFillPatient", payload)
    );

    expect(isEncryptedValue(encrypted.name as string)).toBe(true);
    expect(isEncryptedValue(encrypted.email as string)).toBe(true);
    expect(isEncryptedValue(encrypted.phoneNumber as string)).toBe(true);
    expect(encrypted.emailBlindIndex).toBeDefined();
    expect(encrypted.phoneBlindIndex).toBeDefined();
    expect(encrypted.phoneBlindIndex).not.toBe(payload.phoneBlindIndex);
  });

  it("round-trips SmartFillPatient fields through decrypt", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);
    const payload = buildSmartFillPatientWritePayload();

    const encrypted = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "encrypt" }, async () =>
      encryptModelWriteData(mockPrisma as never, keyResolver, "SmartFillPatient", payload)
    );

    const decrypted = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "decrypt" }, () =>
      decryptModelReadResult(keyResolver, "SmartFillPatient", encrypted)
    );

    expect(decrypted).toMatchObject({
      name: "Max Mustermann",
      email: "max@example.com",
      phoneNumber: "+491701234567",
    });
  });
});
