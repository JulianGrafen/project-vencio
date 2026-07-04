import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { IdentityProvider } from "@calcom/prisma/enums";

vi.mock("@calcom/prisma", () => ({
  prisma: {
    membership: {
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@calcom/prisma";

import {
  canUseAppTwoFactor,
  isDentalTwoFactorRequired,
  isDentalTwoFactorDisableBlockedForUser,
  isDentalTwoFactorSetupRequiredForUser,
} from "./two-factor-policy";

describe("two-factor-policy", () => {
  const originalEncryption = process.env.DENTAL_ENCRYPTION_ENABLED;
  const originalRequire2fa = process.env.DENTAL_REQUIRE_2FA;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = originalEncryption;
    process.env.DENTAL_REQUIRE_2FA = originalRequire2fa;
    vi.clearAllMocks();
  });

  beforeEach(() => {
    delete process.env.DENTAL_REQUIRE_2FA;
  });

  it("requires 2FA by default in compliance mode", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    expect(isDentalTwoFactorRequired()).toBe(true);
  });

  it("allows explicit opt-out via DENTAL_REQUIRE_2FA=false", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    process.env.DENTAL_REQUIRE_2FA = "false";
    expect(isDentalTwoFactorRequired()).toBe(false);
  });

  it("only supports app 2FA for CAL identity provider", () => {
    expect(canUseAppTwoFactor(IdentityProvider.CAL)).toBe(true);
    expect(canUseAppTwoFactor(IdentityProvider.GOOGLE)).toBe(false);
  });

  it("flags practice members without 2FA", async () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    vi.mocked(prisma.membership.count).mockResolvedValue(1);

    const required = await isDentalTwoFactorSetupRequiredForUser({
      userId: 1,
      twoFactorEnabled: false,
      identityProvider: IdentityProvider.CAL,
    });

    expect(required).toBe(true);
  });

  it("does not require 2FA for users without team membership", async () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    vi.mocked(prisma.membership.count).mockResolvedValue(0);

    const required = await isDentalTwoFactorSetupRequiredForUser({
      userId: 2,
      twoFactorEnabled: false,
      identityProvider: IdentityProvider.CAL,
    });

    expect(required).toBe(false);
  });

  it("blocks disable for practice members when policy is active", async () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    vi.mocked(prisma.membership.count).mockResolvedValue(1);

    const blocked = await isDentalTwoFactorDisableBlockedForUser({
      userId: 1,
      identityProvider: IdentityProvider.CAL,
    });

    expect(blocked).toBe(true);
  });
});
