import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getOnboardingEventTypeCreates } from "./onboarding-event-types";

describe("onboarding-event-types", () => {
  const originalPublic = process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
  const originalAppName = process.env.NEXT_PUBLIC_APP_NAME;

  afterEach(() => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = originalPublic;
    process.env.NEXT_PUBLIC_APP_NAME = originalAppName;
  });

  it("returns legacy meeting templates outside dental mode", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "false";
    process.env.NEXT_PUBLIC_APP_NAME = "Cal.diy";
    const events = getOnboardingEventTypeCreates((key) => key);

    expect(events.map((event) => event.slug)).toEqual(["15min", "30min", "secret"]);
  });

  it("returns dental Behandlungsarten in compliance mode", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "true";
    const events = getOnboardingEventTypeCreates((key) => key);

    expect(events.map((event) => event.slug)).toEqual(["kontrolle", "pzr", "schmerz", "behandlung"]);
    expect(events[0]?.metadata).toMatchObject({ dentalCategory: "KONTROLLE" });
    expect(events[0]?.locations?.[0]?.type).toBe("inPerson");
  });

  it("returns dental Behandlungsarten for teeth.al brand without compliance flag", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "false";
    process.env.NEXT_PUBLIC_APP_NAME = "teeth.al";
    const events = getOnboardingEventTypeCreates((key) => key, {
      practiceAddress: "Musterstraße 1, 12345 Berlin",
    });

    expect(events.map((event) => event.slug)).toEqual(["kontrolle", "pzr", "schmerz", "behandlung"]);
    expect(events[0]?.locations?.[0]?.address).toBe("Musterstraße 1, 12345 Berlin");
  });
});
