import { describe, expect, it } from "vitest";

import {
  mapConfirmResultToPage,
  mapDeclineResultToPage,
  missingSmartFillTokenPage,
} from "./smart-fill-action-messages";

describe("smart-fill-action-messages", () => {
  it("maps missing token for confirm", () => {
    expect(missingSmartFillTokenPage("confirm")).toEqual({
      title: "Bestätigung",
      body: "Der Link ist ungültig.",
      status: 400,
    });
  });

  it("maps successful confirm result", () => {
    const page = mapConfirmResultToPage({
      success: true,
      action: "confirmed",
      bookingUid: "uid-1",
      patientName: "Anna",
    });
    expect(page.title).toBe("Termin bestätigt");
    expect(page.body).toContain("Anna");
  });

  it("maps expired confirm result", () => {
    const page = mapConfirmResultToPage({ success: false, reason: "expired" });
    expect(page.body).toContain("nicht mehr verfügbar");
  });

  it("maps successful decline result", () => {
    const page = mapDeclineResultToPage({
      success: true,
      action: "declined",
      patientName: "Max",
    });
    expect(page.title).toBe("Termin abgelehnt");
    expect(page.body).toContain("Max");
  });
});
