import { describe, expect, it } from "vitest";

import { buildSmartFillInviteSmsBody } from "./smart-fill-sms-message";

describe("buildSmartFillInviteSmsBody", () => {
  it("formats German invite SMS with treatment and slot time", () => {
    const body = buildSmartFillInviteSmsBody({
      patientName: "Max",
      slotStart: new Date("2026-07-12T08:00:00.000Z"),
      timeZone: "Europe/Berlin",
      treatmentTitle: "Kontrolle",
    });

    expect(body).toContain("Max");
    expect(body).toContain("Kontrolle");
    expect(body).toContain("JA");
  });
});
