import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateDek } from "./crypto-gcm";
import { PracticeKeyResolver } from "./key-resolver";
import { encryptModelWriteData, encryptNestedWrites } from "./record-crypto";
import { runWithTenantContextAsync } from "./tenant-context";

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
    findUnique: vi.fn(async () => ({ teamId: 42 })),
  },
  booking: {
    findUnique: vi.fn(),
  },
};

describe("record-crypto integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DENTAL_KMS_MASTER_KEY = "12345678901234567890123456789012";
  });

  it("encrypts nested attendees.createMany.data used by createBooking", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);

    const bookingData = {
      eventTypeId: 1,
      title: "Kontrolle",
      attendees: {
        createMany: {
          data: [{ email: "patient@example.com", name: "Max Mustermann", timeZone: "Europe/Berlin" }],
        },
      },
    };

    const encrypted = await runWithTenantContextAsync(
      { teamId: 42, operation: "encrypt" },
      () => encryptNestedWrites(mockPrisma as never, keyResolver, bookingData)
    );

    const attendee = (
      encrypted.attendees as { createMany: { data: { email: string; emailBlindIndex?: string }[] } }
    ).createMany.data[0];

    expect(attendee.email).toMatch(/^enc:v1:42:/);
    expect(attendee.emailBlindIndex).toBeDefined();
    expect(attendee.name).toMatch(/^enc:v1:42:/);
  });

  it("encrypts booking responses JSON", async () => {
    const keyResolver = new PracticeKeyResolver(mockPrisma as never, mockKms);

    const result = await runWithTenantContextAsync({ teamId: 42, operation: "encrypt" }, () =>
      encryptModelWriteData(mockPrisma as never, keyResolver, "Booking", {
        eventTypeId: 1,
        responses: { insuranceType: "GESETZLICH", name: "Max" },
      })
    );

    expect(result.responses as string).toMatch(/^enc:v1:42:/);
  });
});
