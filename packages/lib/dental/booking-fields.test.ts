import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { applyDentalBookingFieldPolicy, isDentalBookingFormActive } from "./booking-fields";

describe("booking-fields", () => {
  const originalEncryption = process.env.DENTAL_ENCRYPTION_ENABLED;
  const originalPublic = process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = originalEncryption;
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = originalPublic;
  });

  beforeEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    delete process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
  });

  it("activates dental booking form with encryption or public compliance flag", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "false";
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "true";
    expect(isDentalBookingFormActive()).toBe(true);
  });

  it("hides notes and injects dental dropdown fields", () => {
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
      {
        name: "guests",
        type: "multiemail",
        required: false,
        sources: [{ label: "Default", id: "default", type: "default" }],
      },
    ]);

    const notes = result.find((f) => f.name === "notes");
    expect(notes?.hidden).toBe(true);
    expect(notes?.required).toBe(false);

    const guests = result.find((f) => f.name === "guests");
    expect(guests?.hidden).toBe(true);

    expect(result.some((f) => f.name === "insuranceType" && f.type === "select")).toBe(true);
    expect(result.some((f) => f.name === "birthDay" && f.type === "select")).toBe(true);
    expect(result.some((f) => f.name === "birthMonth" && f.type === "select")).toBe(true);
    expect(result.some((f) => f.name === "birthYear" && f.type === "select")).toBe(true);
    expect(result.some((f) => f.name === "isNewPatient" && f.type === "select")).toBe(true);

    const insurance = result.find((f) => f.name === "insuranceType");
    expect(insurance?.hidden).not.toBe(true);
  });

  it("passes through unchanged when compliance mode is off", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "false";
    const fields = [{ name: "notes", type: "textarea" as const, required: true }];
    expect(applyDentalBookingFieldPolicy(fields)).toEqual(fields);
  });
});
