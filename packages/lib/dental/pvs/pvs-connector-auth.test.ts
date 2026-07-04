import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { extractBearerToken, hashPvsConnectorApiKey } from "./pvs-connector-key";
import {
  PvsConnectorAuthError,
  assertPvsConnectorAuthorizedForTeam,
  resolvePvsConnectorApiKey,
} from "./pvs-connector-auth";

function assertLegacyGlobalPvsConnectorAuthorized(authHeader: string | null): void {
  const expected = resolvePvsConnectorApiKey();
  if (!expected) {
    throw new PvsConnectorAuthError("PVS connector API is not configured");
  }

  const token = extractBearerToken(authHeader ?? null);
  if (!token || token !== expected) {
    throw new PvsConnectorAuthError();
  }
}

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
    expect(() => assertLegacyGlobalPvsConnectorAuthorized("Bearer secret-connector-key")).not.toThrow();
  });

  it("rejects invalid legacy token", () => {
    expect(() => assertLegacyGlobalPvsConnectorAuthorized("Bearer wrong")).toThrow(PvsConnectorAuthError);
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

  it("falls back to global key when team credential missing in development", async () => {
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      assertPvsConnectorAuthorizedForTeam(prisma as never, "Bearer secret-connector-key", 42)
    ).resolves.toBeUndefined();

    process.env.NODE_ENV = previousEnv;
  });

  it("rejects global key in production without explicit allow flag", async () => {
    const previousEnv = process.env.NODE_ENV;
    const previousAllow = process.env.PVS_CONNECTOR_ALLOW_GLOBAL_KEY;
    process.env.NODE_ENV = "production";
    delete process.env.PVS_CONNECTOR_ALLOW_GLOBAL_KEY;

    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      assertPvsConnectorAuthorizedForTeam(prisma as never, "Bearer secret-connector-key", 42)
    ).rejects.toThrow(PvsConnectorAuthError);

    process.env.NODE_ENV = previousEnv;
    if (previousAllow === undefined) {
      delete process.env.PVS_CONNECTOR_ALLOW_GLOBAL_KEY;
    } else {
      process.env.PVS_CONNECTOR_ALLOW_GLOBAL_KEY = previousAllow;
    }
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
