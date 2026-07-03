import { beforeEach, describe, expect, it, vi } from "vitest";

import { decryptModelReadResult } from "../encryption/model-crypto";
import { PracticeKeyResolver } from "../encryption/key-resolver";
import { encryptModelWriteData, encryptNestedWrites } from "../encryption/record-crypto";
import { runWithTenantContextAsync } from "../encryption/tenant-context";
import { isEncryptedValue } from "../encryption/serialize-encrypted";

const TEAM_ID = 42;

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
    findUnique: vi.fn(async () => ({ teamId: TEAM_ID, parentId: null })),
  },
  booking: {
    findUnique: vi.fn(),
  },
};

/** Mirrors the Prisma write shape produced by createBooking.buildNewBookingData(). */
function buildDentalBookingWritePayload() {
  return {
    eventTypeId: 1,
    userPrimaryEmail: "arzt@praxis.de",
    title: "Kontrolle",
    responses: {
      insuranceType: "GESETZLICH",
      dateOfBirth: "01.01.1990",
      name: "Max Mustermann",
    },
    metadata: { source: "booker" },
    attendees: {
      createMany: {
        data: [
          {
            email: "patient@example.com",
            name: "Max Mustermann",
            timeZone: "Europe/Berlin",
          },
        ],
      },
    },
  };
}

describe("dental booking encryption round-trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    process.env.DENTAL_KMS_MASTER_KEY = "12345678901234567890123456789012";
  });

  it("encrypts a full booking write payload with enc:v1 ciphertext", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);
    const payload = buildDentalBookingWritePayload();

    const encrypted = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "encrypt" }, async () => {
      const withNested = await encryptNestedWrites(mockPrisma as never, keyResolver, payload);
      return encryptModelWriteData(mockPrisma as never, keyResolver, "Booking", withNested);
    });

    expect(encrypted.userPrimaryEmail as string).toMatch(/^enc:v1:42:/);
    expect(encrypted.responses as string).toMatch(/^enc:v1:42:/);

    const attendee = (
      encrypted.attendees as { createMany: { data: { email: string; name: string; emailBlindIndex?: string }[] } }
    ).createMany.data[0];

    expect(isEncryptedValue(attendee.email)).toBe(true);
    expect(isEncryptedValue(attendee.name)).toBe(true);
    expect(attendee.emailBlindIndex).toBeDefined();
    expect(isEncryptedValue(attendee.email)).toBe(true);
  });

  it("round-trips booking and attendee fields through decrypt", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);
    const payload = buildDentalBookingWritePayload();

    const encrypted = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "encrypt" }, async () => {
      const withNested = await encryptNestedWrites(mockPrisma as never, keyResolver, payload);
      return encryptModelWriteData(mockPrisma as never, keyResolver, "Booking", withNested);
    });

    const decryptedBooking = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "decrypt" }, () =>
      decryptModelReadResult(keyResolver, "Booking", encrypted)
    );

    expect(decryptedBooking).toMatchObject({
      userPrimaryEmail: "arzt@praxis.de",
      responses: payload.responses,
    });

    const encryptedAttendee = (
      encrypted.attendees as { createMany: { data: Record<string, unknown>[] } }
    ).createMany.data[0];

    const decryptedAttendee = await runWithTenantContextAsync({ teamId: TEAM_ID, operation: "decrypt" }, () =>
      decryptModelReadResult(keyResolver, "Attendee", encryptedAttendee)
    );

    expect(decryptedAttendee).toMatchObject({
      email: "patient@example.com",
      name: "Max Mustermann",
    });
  });

  it("fails closed when teamId context is missing and encryption is enabled", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);

    await expect(
      encryptModelWriteData(mockPrisma as never, keyResolver, "Booking", {
        responses: { insuranceType: "GESETZLICH" },
      })
    ).rejects.toThrow(/teamId could not be resolved/);
  });
});
