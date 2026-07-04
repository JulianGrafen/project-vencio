import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";
import { BookingStatus, SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { PvsSyncOperation } from "@calcom/prisma/enums";

import { test } from "../lib/fixtures";
import { seedSmartFillInvite } from "./helpers/seed-smart-fill";

test.describe("Dental Smart-Fill email confirm", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("confirms Nachrücktermin via GET /api/smart-fill/confirm", async ({ page, users }) => {
    const organizer = await users.create({}, { hasTeam: true, teamEventSlug: "dental-smart-fill-e2e" });
    const { team } = await organizer.getFirstTeamMembership();
    const teamEvent = await organizer.getFirstTeamEvent(team.id);

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

    const outbox = await prisma.pvsSyncOutbox.findFirst({
      where: {
        teamId: team.id,
        bookingUid: updatedTask.bookingUid ?? undefined,
        operation: PvsSyncOperation.CREATE_APPOINTMENT,
      },
    });

    expect(outbox).not.toBeNull();
    expect(outbox?.payload).toMatchObject({
      source: "smart-fill",
      patientEmail: "e2e-patient@example.com",
    });
  });

  test("declines Nachrücktermin via GET /api/smart-fill/decline", async ({ page, users }) => {
    const organizer = await users.create({}, { hasTeam: true, teamEventSlug: "dental-smart-fill-decline" });
    const { team } = await organizer.getFirstTeamMembership();
    const teamEvent = await organizer.getFirstTeamEvent(team.id);

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
