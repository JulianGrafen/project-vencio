import type { PrismaClient } from "@calcom/prisma";

import { SMART_FILL_DEFAULT_REVENUE_CENTS } from "./constants";

export type SmartFillCronHost = {
  teamId: number;
  userId: number;
  timeZone: string;
  eventTypeId: number | null;
  eventTypeTitle: string | null;
  revenueCents: number;
};

export async function loadSmartFillEligibleHosts(prisma: PrismaClient): Promise<SmartFillCronHost[]> {
  const memberships = await prisma.membership.findMany({
    where: { accepted: true, team: { isOrganization: false } },
    select: {
      teamId: true,
      user: {
        select: {
          id: true,
          timeZone: true,
          eventTypes: {
            where: { hidden: false },
            select: { id: true, title: true, length: true, teamId: true },
            take: 1,
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  return memberships
    .filter((membership) => membership.user.eventTypes.length > 0)
    .map((membership) => {
      const eventType = membership.user.eventTypes[0];
      return {
        teamId: membership.teamId,
        userId: membership.user.id,
        timeZone: membership.user.timeZone,
        eventTypeId: eventType.id,
        eventTypeTitle: eventType.title,
        revenueCents: SMART_FILL_DEFAULT_REVENUE_CENTS,
      };
    });
}
