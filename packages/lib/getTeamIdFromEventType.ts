import prisma from "@calcom/prisma";

import { resolveTeamIdFromEventTypeRecord } from "./dental/practice-team-resolver";

export async function getTeamIdFromEventType({
  eventType,
}: {
  eventType: { team: { id: number | null } | null; parentId: number | null };
}) {
  return resolveTeamIdFromEventTypeRecord(prisma, eventType);
}
