import type { CreateUsersFixture } from "../../fixtures/users";

export async function createDentalTeamOrganizer(
  users: CreateUsersFixture,
  teamEventSlug: string
) {
  const organizer = await users.create({}, { hasTeam: true, teamEventSlug });
  const { team } = await organizer.getFirstTeamMembership();
  const teamEvent = await organizer.getFirstTeamEvent(team.id);
  return { organizer, team, teamEvent };
}
