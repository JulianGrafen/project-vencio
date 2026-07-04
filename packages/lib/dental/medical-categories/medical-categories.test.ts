import { describe, expect, it } from "vitest";

import {
  groupEventTypesByCategory,
  isInsuranceAllowed,
  parseInsuranceType,
  type MedicalProfileSummary,
} from "./medical-categories";

function buildProfile(overrides: Partial<MedicalProfileSummary> = {}): MedicalProfileSummary {
  return {
    category: "SONSTIGES",
    allowedInsuranceTypes: [],
    displayOrder: 0,
    isEmergency: false,
    ...overrides,
  };
}

describe("parseInsuranceType", () => {
  it("parses a valid insurance type", () => {
    expect(parseInsuranceType("GESETZLICH")).toBe("GESETZLICH");
  });

  it.each([null, undefined, "", "KASSE", 42, {}])("returns null for invalid input %p", (input) => {
    expect(parseInsuranceType(input)).toBeNull();
  });
});

describe("isInsuranceAllowed", () => {
  it("allows every insurance type when the allow-list is empty", () => {
    expect(isInsuranceAllowed([], "GESETZLICH")).toBe(true);
    expect(isInsuranceAllowed([], "PRIVAT")).toBe(true);
  });

  it("allows only listed insurance types when restricted", () => {
    const privateOnly = ["PRIVAT", "SELBSTZAHLER"] as const;

    expect(isInsuranceAllowed([...privateOnly], "PRIVAT")).toBe(true);
    expect(isInsuranceAllowed([...privateOnly], "GESETZLICH")).toBe(false);
  });
});

describe("groupEventTypesByCategory", () => {
  it("groups event types by category ordered by patient intent (pain first)", () => {
    const eventTypes = [
      { id: 1, medicalProfile: buildProfile({ category: "PROPHYLAXE" }) },
      { id: 2, medicalProfile: buildProfile({ category: "SCHMERZBEHANDLUNG", isEmergency: true }) },
      { id: 3, medicalProfile: buildProfile({ category: "PROPHYLAXE", displayOrder: 1 }) },
    ];

    const groups = groupEventTypesByCategory(eventTypes);

    expect(groups.map((group) => group.definition.category)).toEqual([
      "SCHMERZBEHANDLUNG",
      "PROPHYLAXE",
    ]);
    expect(groups[1].eventTypes.map((eventType) => eventType.id)).toEqual([1, 3]);
  });

  it("falls back to SONSTIGES for event types without a medical profile", () => {
    const groups = groupEventTypesByCategory([{ id: 1, medicalProfile: null }, { id: 2 }]);

    expect(groups).toHaveLength(1);
    expect(groups[0].definition.category).toBe("SONSTIGES");
    expect(groups[0].eventTypes).toHaveLength(2);
  });

  it("omits empty groups", () => {
    const groups = groupEventTypesByCategory([
      { id: 1, medicalProfile: buildProfile({ category: "KONTROLLE" }) },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].definition.category).toBe("KONTROLLE");
  });

  it("filters event types the selected insurance may not book", () => {
    const eventTypes = [
      {
        id: 1,
        medicalProfile: buildProfile({
          category: "IMPLANTOLOGIE",
          allowedInsuranceTypes: ["PRIVAT", "SELBSTZAHLER"],
        }),
      },
      { id: 2, medicalProfile: buildProfile({ category: "KONTROLLE" }) },
    ];

    const groups = groupEventTypesByCategory(eventTypes, "GESETZLICH");

    expect(groups).toHaveLength(1);
    expect(groups[0].definition.category).toBe("KONTROLLE");
  });

  it("keeps all event types when no insurance is selected", () => {
    const eventTypes = [
      {
        id: 1,
        medicalProfile: buildProfile({ allowedInsuranceTypes: ["PRIVAT"] }),
      },
    ];

    const groups = groupEventTypesByCategory(eventTypes, null);

    expect(groups[0].eventTypes).toHaveLength(1);
  });

  it("sorts emergency event types before regular ones within a group", () => {
    const eventTypes = [
      { id: 1, medicalProfile: buildProfile({ category: "SONSTIGES", displayOrder: 0 }) },
      {
        id: 2,
        medicalProfile: buildProfile({ category: "SONSTIGES", displayOrder: 5, isEmergency: true }),
      },
    ];

    const groups = groupEventTypesByCategory(eventTypes);

    expect(groups[0].eventTypes.map((eventType) => eventType.id)).toEqual([2, 1]);
  });
});
