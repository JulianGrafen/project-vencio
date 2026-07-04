import { describe, expect, it } from "vitest";

import { buildSmartFillInviteEmail } from "./smart-fill-invite-email";

describe("buildSmartFillInviteEmail", () => {
  it("includes confirm and decline links with patient name", () => {
    const email = buildSmartFillInviteEmail({
      patientName: "Anna",
      patientEmail: "anna@example.com",
      slotStart: new Date("2026-07-12T10:00:00Z"),
      timeZone: "Europe/Berlin",
      treatmentTitle: "Kontrolle",
      practiceName: "Praxis Sonnenschein",
      confirmToken: "test-token-123",
    });

    expect(email.to).toBe("anna@example.com");
    expect(email.subject).toContain("Praxis Sonnenschein");
    expect(email.html).toContain("Anna");
    expect(email.html).toContain("/api/smart-fill/confirm?token=test-token-123");
    expect(email.html).toContain("/api/smart-fill/decline?token=test-token-123");
    expect(email.text).toContain("Termin bestätigen");
  });
});
