import { describe, expect, it, vi } from "vitest";

import { hashPvsConnectorApiKey } from "./pvs-connector-key";
import { PvsConnectorCredentialService } from "./pvs-connector-credential.service";

describe("PvsConnectorCredentialService", () => {
  it("creates credential with hashed key and returns raw key once", async () => {
    const create = vi.fn(async ({ data, select }) => ({
      id: "cred-1",
      label: data.label,
      keyPrefix: data.keyPrefix,
      isActive: true,
      lastUsedAt: null,
      createdAt: new Date(),
      revokedAt: null,
    }));

    const prisma = { pvsConnectorCredential: { create } };
    const service = new PvsConnectorCredentialService(prisma as never);

    const result = await service.create(7, "LAN Connector");

    expect(result.rawApiKey).toMatch(/^pvs_/);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          teamId: 7,
          hashedApiKey: hashPvsConnectorApiKey(result.rawApiKey),
          keyPrefix: result.rawApiKey.slice(0, 12),
        }),
      })
    );
  });

  it("verifies active team credential and updates lastUsedAt", async () => {
    const rawKey = "pvs_test_key_for_verification_only";
    const findFirst = vi.fn().mockResolvedValue({ id: "cred-1" });
    const update = vi.fn().mockResolvedValue({});

    const prisma = {
      pvsConnectorCredential: { findFirst, update },
    };
    const service = new PvsConnectorCredentialService(prisma as never);

    const ok = await service.verifyTeamAccess(7, rawKey);

    expect(ok).toBe(true);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          teamId: 7,
          hashedApiKey: hashPvsConnectorApiKey(rawKey),
        }),
      })
    );
    expect(update).toHaveBeenCalled();
  });

  it("rejects unknown credential", async () => {
    const prisma = {
      pvsConnectorCredential: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };
    const service = new PvsConnectorCredentialService(prisma as never);

    expect(await service.verifyTeamAccess(7, "pvs_unknown")).toBe(false);
  });
});
