import { describe, expect, it, vi, beforeEach } from "vitest";

import { MembershipRole } from "@calcom/prisma/enums";

import { PermissionCheckService } from "./permission-check.service";

const findFirst = vi.fn();
const findMany = vi.fn();
const hasMembership = vi.fn();

vi.mock("@calcom/prisma", () => ({
  prisma: {
    membership: {
      findFirst: (...args: unknown[]) => findFirst(...args),
      findMany: (...args: unknown[]) => findMany(...args),
    },
  },
}));

vi.mock("@calcom/features/membership/repositories/MembershipRepository", () => ({
  MembershipRepository: class {
    hasMembership = hasMembership;
  },
}));

describe("PermissionCheckService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when user is not in fallback roles", async () => {
    findFirst.mockResolvedValue(null);
    const service = new PermissionCheckService();

    await expect(
      service.checkPermission({
        userId: 1,
        teamId: 10,
        permission: "booking.readTeamBookings",
        fallbackRoles: [MembershipRole.ADMIN, MembershipRole.OWNER],
      })
    ).resolves.toBe(false);
  });

  it("returns true when membership matches fallback roles", async () => {
    findFirst.mockResolvedValue({ id: 99 });
    const service = new PermissionCheckService();

    await expect(
      service.checkPermission({
        userId: 1,
        teamId: 10,
        permission: "booking.readTeamBookings",
        fallbackRoles: [MembershipRole.ADMIN],
      })
    ).resolves.toBe(true);
  });

  it("returns team ids for matching memberships", async () => {
    findMany.mockResolvedValue([{ teamId: 3 }, { teamId: 7 }]);
    const service = new PermissionCheckService();

    await expect(
      service.getTeamIdsWithPermission({
        userId: 1,
        permission: "team.read",
      })
    ).resolves.toEqual([3, 7]);
  });
});
