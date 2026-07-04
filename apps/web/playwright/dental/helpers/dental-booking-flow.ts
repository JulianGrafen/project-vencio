import type { Page } from "@playwright/test";

import { bookTimeSlot, selectFirstAvailableTimeSlotNextMonth } from "../../lib/testUtils";

export async function isDentalComplianceUiActive(page: Page): Promise<boolean> {
  return page
    .getByTestId("insurance-type-step")
    .isVisible({ timeout: 1500 })
    .catch(() => false);
}

export async function completeInsuranceTypeStepIfPresent(page: Page, value: "GESETZLICH" | "PRIVAT" | "SELBSTZAHLER" = "GESETZLICH") {
  const insuranceStep = page.getByTestId("insurance-type-step");
  if (!(await insuranceStep.isVisible({ timeout: 2000 }).catch(() => false))) {
    return false;
  }

  await page.getByTestId(`insurance-type-${value.toLowerCase()}`).click();
  return true;
}

export async function fillDentalPatientFieldsIfPresent(page: Page) {
  const dateOfBirth = page.locator('[name="responses.dateOfBirth"]');
  if (await dateOfBirth.isVisible({ timeout: 1000 }).catch(() => false)) {
    await dateOfBirth.fill("01.01.1990");
  }

  const newPatientToggle = page.locator('[name="responses.isNewPatient"]');
  if (await newPatientToggle.isVisible({ timeout: 1000 }).catch(() => false)) {
    const inputType = await newPatientToggle.getAttribute("type");
    if (inputType === "checkbox") {
      await newPatientToggle.check();
    } else {
      await newPatientToggle.fill("true");
    }
  }
}

export async function selectFirstAvailableTimeSlotNextMonthWithDentalFlow(page: Page) {
  await completeInsuranceTypeStepIfPresent(page);
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
