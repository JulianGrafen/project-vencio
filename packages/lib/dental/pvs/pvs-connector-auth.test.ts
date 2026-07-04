import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  PvsConnectorAuthError,
  assertPvsConnectorAuthorized,
  assertPvsConnectorAuthorizedForTeam,
} from "./pvs-connector-auth";
import { hashPvsConnectorApiKey } from "./pvs-connector-key";

describe("pvs-connector-auth", () => {
  const originalKey = process.env.PVS_CONNECTOR_API_KEY;

  beforeEach(() => {
    process.env.PVS_CONNECTOR_API_KEY = "secret-connector-key";
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.PVS_CONNECTOR_API_KEY;
    } else {
      process.env.PVS_CONNECTOR_API_KEY = originalKey;
    }
  });

  it("accepts legacy global bearer token", () => {
    expect(() => assertPvsConnectorAuthorized("Bearer secret-connector-key")).not.toThrow();
  });

  it("rejects invalid legacy token", () => {
    expect(() => assertPvsConnectorAuthorized("Bearer wrong")).toThrow(PvsConnectorAuthError);
  });

  it("accepts per-team credential token", async () => {
    const rawKey = "pvs_team_specific_key_1234567890";
    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue({ id: "cred-1" }),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    await expect(
      assertPvsConnectorAuthorizedForTeam(prisma as never, `Bearer ${rawKey}`, 42)
    ).resolves.toBeUndefined();

    expect(prisma.pvsConnectorCredential.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          teamId: 42,
          hashedApiKey: hashPvsConnectorApiKey(rawKey),
        }),
      })
    );
  });

  it("falls back to global key when team credential missing", async () => {
    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      assertPvsConnectorAuthorizedForTeam(prisma as never, "Bearer secret-connector-key", 42)
    ).resolves.toBeUndefined();
  });

  it("rejects when neither team nor global key matches", async () => {
    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      assertPvsConnectorAuthorizedForTeam(prisma as never, "Bearer wrong", 42)
    ).rejects.toThrow(PvsConnectorAuthError);
  });
});
