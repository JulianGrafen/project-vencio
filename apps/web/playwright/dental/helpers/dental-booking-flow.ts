import type { Page } from "@playwright/test";

import { bookTimeSlot, selectFirstAvailableTimeSlotNextMonth } from "../../lib/testUtils";

export async function isDentalComplianceUiActive(page: Page): Promise<boolean> {
  return page
    .getByTestId("practice-info-header")
    .isVisible({ timeout: 3000 })
    .catch(() => false);
}

export async function fillDentalPatientFieldsIfPresent(page: Page) {
  const insuranceType = page.locator('[name="responses.insuranceType"]');
  if (await insuranceType.isVisible({ timeout: 1000 }).catch(() => false)) {
    await insuranceType.selectOption("GESETZLICH");
  }

  const birthDay = page.locator('[name="responses.birthDay"]');
  if (await birthDay.isVisible({ timeout: 1000 }).catch(() => false)) {
    await birthDay.selectOption("01");
    await page.locator('[name="responses.birthMonth"]').selectOption("01");
    await page.locator('[name="responses.birthYear"]').selectOption("1990");
  }

  const patientStatus = page.locator('[name="responses.isNewPatient"]');
  if (await patientStatus.isVisible({ timeout: 1000 }).catch(() => false)) {
    await patientStatus.selectOption("FIRST");
  }
}

export async function selectFirstAvailableTimeSlotNextMonthWithDentalFlow(page: Page) {
  await selectFirstAvailableTimeSlotNextMonth(page);
}

export async function bookDentalTimeSlot(
  page: Page,
  opts?: Parameters<typeof bookTimeSlot>[1]
) {
  await selectFirstAvailableTimeSlotNextMonthWithDentalFlow(page);
  await fillDentalPatientFieldsIfPresent(page);
  await bookTimeSlot(page, opts);
}
