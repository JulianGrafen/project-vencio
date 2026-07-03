import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";

const { mockHasMembership, mockGetAdminOrOwnerMembership } = vi.hoisted(() => ({
  mockHasMembership: vi.fn(),
  mockGetAdminOrOwnerMembership: vi.fn(),
}));

vi.mock("@calcom/features/membership/repositories/MembershipRepository", () => {
  const MembershipRepository = vi.fn(function (this: { hasMembership: typeof mockHasMembership }) {
    this.hasMembership = mockHasMembership;
  });
  MembershipRepository.getAdminOrOwnerMembership = mockGetAdminOrOwnerMembership;
  return { MembershipRepository };
});

import {
  assertAcceptedTeamMembership,
  assertAdminOrOwnerTeamMembership,
} from "./assert-team-membership";

describe("assert-team-membership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("assertAcceptedTeamMembership passes when user is a member", async () => {
    mockHasMembership.mockResolvedValue(true);
    await expect(assertAcceptedTeamMembership(1, 10)).resolves.toBeUndefined();
    expect(mockHasMembership).toHaveBeenCalledWith({ userId: 1, teamId: 10 });
  });

  it("assertAcceptedTeamMembership throws FORBIDDEN when not a member", async () => {
    mockHasMembership.mockResolvedValue(false);
    await expect(assertAcceptedTeamMembership(1, 10)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("assertAdminOrOwnerTeamMembership passes for admin/owner", async () => {
    mockGetAdminOrOwnerMembership.mockResolvedValue({ id: 1 });
    await expect(assertAdminOrOwnerTeamMembership(1, 10)).resolves.toBeUndefined();
  });

  it("assertAdminOrOwnerTeamMembership throws FORBIDDEN for regular members", async () => {
    mockGetAdminOrOwnerMembership.mockResolvedValue(null);
    await expect(assertAdminOrOwnerTeamMembership(1, 10)).rejects.toBeInstanceOf(TRPCError);
  });
});
