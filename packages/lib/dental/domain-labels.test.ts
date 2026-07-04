import { describe, expect, it } from "vitest";

import { DENTAL_DOMAIN_LABELS, getDentalDomainLabel } from "./domain-labels";

describe("domain-labels", () => {
  it("maps Cal.com concepts to dental terminology", () => {
    expect(DENTAL_DOMAIN_LABELS.eventType).toBe("Behandlungsart");
    expect(DENTAL_DOMAIN_LABELS.attendee).toBe("Patient");
    expect(getDentalDomainLabel("team")).toBe("Praxis");
  });
});
