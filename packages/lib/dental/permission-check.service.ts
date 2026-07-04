import { MembershipRepository } from "@calcom/features/membership/repositories/MembershipRepository";
import { prisma } from "@calcom/prisma";
import type { MembershipRole } from "@calcom/prisma/enums";
import { MembershipRole as Role } from "@calcom/prisma/enums";

type CheckPermissionParams = {
  userId: number;
  teamId: number;
  permission: string;
  fallbackRoles?: MembershipRole[];
};

/**
 * Role-based permission checks for the dental fork.
 * Replaces upstream PBAC stubs that always returned true (critical auth bypass).
 */
export class PermissionCheckService {
  constructor(_prisma?: unknown) {}

  async checkPermission({
    userId,
    teamId,
    permission: _permission,
    fallbackRoles = [Role.ADMIN, Role.OWNER],
  }: CheckPermissionParams): Promise<boolean> {
    if (!userId || !teamId) {
      return false;
    }

    if (fallbackRoles.length === 0) {
      const repository = new MembershipRepository();
      return repository.hasMembership({ userId, teamId });
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        teamId,
        accepted: true,
        role: { in: fallbackRoles },
      },
      select: { id: true },
    });

    return membership !== null;
  }

  async hasPermission(params: CheckPermissionParams): Promise<boolean> {
    return this.checkPermission(params);
  }

  async getTeamIdsWithPermission({
    userId,
    permission: _permission,
    fallbackRoles = [Role.ADMIN, Role.OWNER],
  }: {
    userId: number;
    permission: string;
    fallbackRoles?: MembershipRole[];
  }): Promise<number[]> {
    const memberships = await prisma.membership.findMany({
      where: {
        userId,
        accepted: true,
        role: { in: fallbackRoles },
      },
      select: { teamId: true },
    });

    return memberships.map((membership) => membership.teamId);
  }
}
