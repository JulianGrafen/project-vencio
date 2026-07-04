import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";
import { PvsSyncOperation } from "@calcom/prisma/enums";

import { test } from "../lib/fixtures";
import { bookTimeSlot, selectFirstAvailableTimeSlotNextMonth, testEmail } from "../lib/testUtils";

test.describe("Dental booker → PVS outbox", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("enqueues CREATE_APPOINTMENT outbox row for team booking", async ({ page, users }) => {
    const organizer = await users.create({}, { hasTeam: true, teamEventSlug: "dental-pvs-booker-e2e" });
    const { team } = await organizer.getFirstTeamMembership();
    const teamEvent = await organizer.getFirstTeamEvent(team.id);

    await page.goto(`/${team.slug}/${teamEvent.slug}`);
    await selectFirstAvailableTimeSlotNextMonth(page);
    await bookTimeSlot(page, { email: testEmail, name: "PVS Booker E2E" });

    const booking = await prisma.booking.findFirst({
      where: {
        eventTypeId: teamEvent.id,
        attendees: { some: { email: testEmail } },
      },
      orderBy: { createdAt: "desc" },
    });

    expect(booking).not.toBeNull();

    const outbox = await prisma.pvsSyncOutbox.findFirst({
      where: {
        teamId: team.id,
        bookingUid: booking!.uid,
        operation: PvsSyncOperation.CREATE_APPOINTMENT,
      },
    });

    expect(outbox).not.toBeNull();
    expect(outbox?.payload).toMatchObject({
      source: "booker",
      patientEmail: testEmail,
      teamId: team.id,
    });
  });
});
