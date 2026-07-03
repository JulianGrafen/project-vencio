import { beforeEach, describe, expect, it, vi } from "vitest";

const mockWrapDek = vi.fn(async (dek: Buffer) => `wrapped:${dek.toString("hex").slice(0, 8)}`);
const mockUnwrapDek = vi.fn(async (encrypted: string) => {
  const hex = encrypted.replace("wrapped:", "");
  return Buffer.alloc(32, hex);
});

vi.mock("./kms", () => ({
  createKeyManagementService: () => ({
    wrapDek: mockWrapDek,
    unwrapDek: mockUnwrapDek,
    getProviderKeyId: () => "test-kms",
  }),
}));

import { getPracticeKeyResolver, PracticeKeyResolver } from "./key-resolver";

describe("getPracticeKeyResolver", () => {
  const mockPrisma = {
    practiceEncryptionKey: {
      findUnique: vi.fn(async () => null),
      upsert: vi.fn(async ({ create }: { create: { encryptedDek: string; keyVersion: number } }) => ({
        encryptedDek: create.encryptedDek,
        keyVersion: create.keyVersion,
        isActive: true,
      })),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DENTAL_KMS_MASTER_KEY = "12345678901234567890123456789012";
  });

  it("returns the same resolver instance for the same prisma client", () => {
    const first = getPracticeKeyResolver(mockPrisma as never);
    const second = getPracticeKeyResolver(mockPrisma as never);

    expect(first).toBe(second);
    expect(first).toBeInstanceOf(PracticeKeyResolver);
  });

  it("returns different resolver instances for different prisma clients", () => {
    const prismaA = { practiceEncryptionKey: mockPrisma.practiceEncryptionKey };
    const prismaB = { practiceEncryptionKey: mockPrisma.practiceEncryptionKey };

    expect(getPracticeKeyResolver(prismaA as never)).not.toBe(getPracticeKeyResolver(prismaB as never));
  });
});
