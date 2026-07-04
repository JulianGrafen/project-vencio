import { expect } from "@playwright/test";

import { prisma } from "@calcom/prisma";

import { test } from "../lib/fixtures";
import { createDentalTeamOrganizer } from "./helpers/create-dental-team-organizer";
import { seedRecallOptOut } from "./helpers/seed-recall-opt-out";

test.describe("Dental Recall opt-out", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("opts out via GET /api/recall/opt-out", async ({ page, users }) => {
    const { team } = await createDentalTeamOrganizer(users, "dental-recall-opt-out-e2e");

    const { patient, optOutToken } = await seedRecallOptOut({
      teamId: team.id,
      patientName: "Anna Recall",
    });

    const response = await page.request.get(`/api/recall/opt-out?token=${optOutToken}`);
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).toContain("Erinnerungen abbestellt");
    expect(html).toContain("Anna Recall");

    const updatedPatient = await prisma.smartFillPatient.findUniqueOrThrow({ where: { id: patient.id } });
    expect(updatedPatient.recallEnabled).toBe(false);
  });

  test("returns friendly message when already opted out", async ({ page, users }) => {
    const { team } = await createDentalTeamOrganizer(users, "dental-recall-already-out");

    const { optOutToken } = await seedRecallOptOut({
      teamId: team.id,
      recallEnabled: false,
    });

    const response = await page.request.get(`/api/recall/opt-out?token=${optOutToken}`);
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).toContain("bereits abbestellt");
  });

  test("rejects invalid opt-out token", async ({ page, users }) => {
    await createDentalTeamOrganizer(users, "dental-recall-invalid-token");

    const response = await page.request.get("/api/recall/opt-out?token=not-a-valid-uuid");
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).toContain("ungültig");
  });
});
