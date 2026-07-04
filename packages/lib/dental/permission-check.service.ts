import type { PrismaClient } from "@calcom/prisma";
import { prisma } from "@calcom/prisma";
import type { MembershipRole } from "@calcom/prisma/enums";
import { MembershipRole as Role } from "@calcom/prisma/enums";

export type PermissionString = string;

type CheckPermissionParams = {
  userId: number;
  teamId: number;
  permission: PermissionString;
  fallbackRoles?: MembershipRole[];
};

type MembershipDb = Pick<PrismaClient, "membership">;

/**
 * Role-based permission checks for the dental fork.
 * Replaces upstream PBAC stubs that always returned true (critical auth bypass).
 */
export class PermissionCheckService {
  constructor(private readonly db: MembershipDb = prisma) {}

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
      const membership = await this.db.membership.findFirst({
        where: { userId, teamId, accepted: true },
        select: { id: true },
      });
      return membership !== null;
    }

    const membership = await this.db.membership.findFirst({
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
    orgId?: number;
  }): Promise<number[]> {
    const memberships = await this.db.membership.findMany({
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
