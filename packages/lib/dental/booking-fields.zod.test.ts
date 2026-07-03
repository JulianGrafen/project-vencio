import { describe, expect, it } from "vitest";

import { eventTypeBookingFields } from "@calcom/prisma/zod-utils";

import { applyDentalBookingFieldPolicy, DENTAL_PATIENT_BOOKING_FIELDS } from "./booking-fields";

describe("booking-fields zod compatibility", () => {
  it("dental default fields pass eventTypeBookingFields schema", () => {
    const parsed = eventTypeBookingFields.safeParse(DENTAL_PATIENT_BOOKING_FIELDS);
    expect(parsed.success).toBe(true);
  });

  it("applyDentalBookingFieldPolicy output passes schema", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    const result = applyDentalBookingFieldPolicy([
      {
        name: "name",
        type: "name",
        required: true,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
      {
        name: "email",
        type: "email",
        required: true,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
      {
        name: "notes",
        type: "textarea",
        required: false,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
    ]);

    const parsed = eventTypeBookingFields.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});
