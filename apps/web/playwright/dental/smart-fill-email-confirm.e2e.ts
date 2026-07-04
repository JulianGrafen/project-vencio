import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";
import { BookingStatus, SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

import { test } from "../lib/fixtures";
import { expectPvsCreateOutbox } from "./helpers/assert-pvs-outbox";
import { createDentalTeamOrganizer } from "./helpers/create-dental-team-organizer";
import { seedSmartFillInvite } from "./helpers/seed-smart-fill";

test.describe("Dental Smart-Fill email confirm", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("confirms Nachrücktermin via GET /api/smart-fill/confirm", async ({ page, users }) => {
    const { organizer, team, teamEvent } = await createDentalTeamOrganizer(
      users,
      "dental-smart-fill-e2e"
    );

    const { confirmToken, task, holdBookingUid } = await seedSmartFillInvite({
      teamId: team.id,
      userId: organizer.id,
      eventTypeId: teamEvent.id,
      withHoldBooking: true,
    });

    const response = await page.request.get(`/api/smart-fill/confirm?token=${confirmToken}`);
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).toContain("Termin bestätigt");
    expect(html).toContain("E2E Patient");

    const updatedTask = await prisma.smartFillTask.findUniqueOrThrow({ where: { id: task.id } });
    expect(updatedTask.status).toBe(SmartFillTaskStatus.CONFIRMED);
    expect(updatedTask.bookingUid).toBeTruthy();

    const updatedInvite = await prisma.smartFillInvite.findFirstOrThrow({ where: { taskId: task.id } });
    expect(updatedInvite.status).toBe(SmartFillInviteStatus.REPLIED_YES);

    if (holdBookingUid) {
      const holdBooking = await prisma.booking.findUniqueOrThrow({ where: { uid: holdBookingUid } });
      expect(holdBooking.status).toBe(BookingStatus.ACCEPTED);
    }

    await expectPvsCreateOutbox({
      teamId: team.id,
      bookingUid: updatedTask.bookingUid!,
      payload: { source: "smart-fill", patientEmail: "e2e-patient@example.com" },
    });
  });

  test("declines Nachrücktermin via GET /api/smart-fill/decline", async ({ page, users }) => {
    const { organizer, team, teamEvent } = await createDentalTeamOrganizer(
      users,
      "dental-smart-fill-decline"
    );

    const { confirmToken, task } = await seedSmartFillInvite({
      teamId: team.id,
      userId: organizer.id,
      eventTypeId: teamEvent.id,
    });

    const response = await page.request.get(`/api/smart-fill/decline?token=${confirmToken}`);
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).toContain("Termin abgelehnt");

    const updatedInvite = await prisma.smartFillInvite.findFirstOrThrow({ where: { taskId: task.id } });
    expect(updatedInvite.status).toBe(SmartFillInviteStatus.REPLIED_NO);
  });
});
