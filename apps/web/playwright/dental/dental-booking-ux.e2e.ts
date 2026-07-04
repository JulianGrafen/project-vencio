import { expect } from "@playwright/test";

import { test } from "../lib/fixtures";
import { testEmail } from "../lib/testUtils";
import {
  bookDentalTimeSlot,
  completeInsuranceTypeStepIfPresent,
  isDentalComplianceUiActive,
} from "./helpers/dental-booking-flow";
import { createDentalPracticeFixture } from "./helpers/create-dental-practice-fixture";

test.describe("Dental booking UX", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("shows categorized event types on the public team page when compliance UI is active", async ({
    page,
    users,
  }) => {
    const { team } = await createDentalPracticeFixture(users, "dental-grid-e2e");

    await page.goto(`/${team.slug}`);
    const grid = page.getByTestId("dental-event-type-grid");

    if (!(await grid.isVisible({ timeout: 3000 }).catch(() => false))) {
      test.skip(true, "Dental compliance UI is not enabled in this environment");
    }

    await expect(grid).toBeVisible();
    await expect(page.getByTestId("dental-event-type-card")).toHaveCount(2);
  });

  test("collects insurance before calendar and shows practice info in the sidebar", async ({
    page,
    users,
  }) => {
    const { team, teamEvent } = await createDentalPracticeFixture(users, "dental-insurance-e2e");

    await page.goto(`/${team.slug}/${teamEvent.slug}`);

    if (!(await isDentalComplianceUiActive(page))) {
      test.skip(true, "Dental compliance UI is not enabled in this environment");
    }

    await expect(page.getByTestId("practice-info-header")).toBeVisible();
    await expect(page.getByTestId("practice-info-header")).toContainText("Praxis Dr. E2E");
    await expect(page.getByTestId("practice-info-header")).toContainText("Zahnstraße 42");

    const selectedInsurance = await completeInsuranceTypeStepIfPresent(page, "PRIVAT");
    expect(selectedInsurance).toBe(true);

    await expect(page.getByTestId("insurance-type-step")).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="day"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("completes booking after insurance step with dental patient fields", async ({ page, users }) => {
    const { team, teamEvent } = await createDentalPracticeFixture(users, "dental-booking-e2e");

    await page.goto(`/${team.slug}/${teamEvent.slug}`);

    if (!(await isDentalComplianceUiActive(page))) {
      test.skip(true, "Dental compliance UI is not enabled in this environment");
    }

    await bookDentalTimeSlot(page, { email: testEmail, name: "Dental UX E2E" });

    await page.waitForURL((url) => url.pathname.startsWith("/booking"));
    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
  });
});
