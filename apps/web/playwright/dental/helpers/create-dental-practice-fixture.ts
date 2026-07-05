import { prisma } from "@calcom/prisma";
import { SchedulingType } from "@calcom/prisma/enums";

import type { CreateUsersFixture } from "../../fixtures/users";
import { createDentalTeamOrganizer } from "./create-dental-team-organizer";

export async function createDentalPracticeFixture(users: CreateUsersFixture, teamEventSlug = "dental-ux-e2e") {
  const { organizer, team, teamEvent } = await createDentalTeamOrganizer(users, teamEventSlug);

  await prisma.team.update({
    where: { id: team.id },
    data: {
      name: "Praxis Dr. E2E",
      metadata: {
        dental: {
          practiceName: "Praxis Dr. E2E",
          practiceAddress: "Zahnstraße 42, 10115 Berlin",
          emergencyPhone: "+49 30 99887766",
        },
      },
    },
  });

  await prisma.eventType.update({
    where: { id: teamEvent.id },
    data: {
      metadata: {
        dentalCategory: "KONTROLLE",
      },
    },
  });

  const pzrEvent = await prisma.eventType.create({
    data: {
      title: "PZR E2E",
      slug: `${teamEventSlug}-pzr`,
      length: 45,
      teamId: team.id,
      schedulingType: SchedulingType.COLLECTIVE,
      metadata: {
        dentalCategory: "PROPHYLAXE",
      },
      locations: [{ type: "inPerson", address: "" }],
      users: {
        connect: { id: organizer.id },
      },
      owner: {
        connect: { id: organizer.id },
      },
      hosts: {
        create: {
          userId: organizer.id,
          isFixed: true,
        },
      },
    },
  });

  return { organizer, team, teamEvent, pzrEvent };
}
