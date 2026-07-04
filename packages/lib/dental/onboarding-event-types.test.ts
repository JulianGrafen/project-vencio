import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getOnboardingEventTypeCreates } from "./onboarding-event-types";

describe("onboarding-event-types", () => {
  const originalPublic = process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = originalPublic;
  });

  it("returns legacy meeting templates outside dental mode", () => {
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "false";
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
});
