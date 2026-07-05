import { describe, expect, it } from "vitest";

import { groupEventTypesByDentalCategory } from "./group-event-types-by-category";

describe("group-event-types-by-category", () => {
  it("groups event types by dentalCategory metadata with stable order", () => {
    const groups = groupEventTypesByDentalCategory(
      [
        { id: 1, title: "PZR", slug: "pzr", length: 45, metadata: { dentalCategory: "PROPHYLAXE" } },
        { id: 2, title: "Kontrolle", slug: "kontrolle", length: 15, metadata: { dentalCategory: "KONTROLLE" } },
        { id: 3, title: "Sonstiges", slug: "other", length: 30, metadata: {} },
      ],
      (category) => category
    );

    expect(groups.map((group) => group.category)).toEqual(["KONTROLLE", "PROPHYLAXE", "SONSTIGES"]);
    expect(groups[2]?.eventTypes[0]?.slug).toBe("other");
  });
});
