import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";

import { test } from "../lib/fixtures";
import { bookTimeSlot, selectFirstAvailableTimeSlotNextMonth, testEmail } from "../lib/testUtils";
import { expectPvsCreateOutbox } from "./helpers/assert-pvs-outbox";
import { createDentalTeamOrganizer } from "./helpers/create-dental-team-organizer";

test.describe("Dental booker → PVS outbox", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("enqueues CREATE_APPOINTMENT outbox row for team booking", async ({ page, users }) => {
    const { team, teamEvent } = await createDentalTeamOrganizer(users, "dental-pvs-booker-e2e");

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

    await expectPvsCreateOutbox({
      teamId: team.id,
      bookingUid: booking!.uid,
      payload: { source: "booker", patientEmail: testEmail, teamId: team.id },
    });
  });
});
