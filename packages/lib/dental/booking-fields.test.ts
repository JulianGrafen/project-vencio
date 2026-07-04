import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { applyDentalBookingFieldPolicy } from "./booking-fields";

describe("booking-fields", () => {
  const original = process.env.DENTAL_ENCRYPTION_ENABLED;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = original;
  });

  beforeEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
  });

  it("hides notes and injects dental patient fields", () => {
    const result = applyDentalBookingFieldPolicy([
      {
        name: "email",
        type: "email",
        required: true,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
      {
        name: "notes",
        type: "textarea",
        required: true,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
    ]);

    const notes = result.find((f) => f.name === "notes");
    expect(notes?.hidden).toBe(true);
    expect(notes?.required).toBe(false);

    expect(result.some((f) => f.name === "insuranceType")).toBe(true);
    expect(result.some((f) => f.name === "dateOfBirth")).toBe(true);
    expect(result.some((f) => f.name === "isNewPatient")).toBe(true);

    const insurance = result.find((f) => f.name === "insuranceType");
    expect(insurance?.hidden).toBe(true);
  });

  it("passes through unchanged when compliance mode is off", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "false";
    const fields = [{ name: "notes", type: "textarea" as const, required: true }];
    expect(applyDentalBookingFieldPolicy(fields)).toEqual(fields);
  });
});
