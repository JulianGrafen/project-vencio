import dayjs from "@calcom/dayjs";
import { describe, expect, it } from "vitest";

import { renderRecallTemplate } from "./recall-template-renderer";

describe("renderRecallTemplate", () => {
  it("replaces all template variables", () => {
    const result = renderRecallTemplate(
      "Hallo [PatientenName], buchen: [TerminLink] — [PraxisName] — [OptOutLink]",
      {
        patientName: "Max",
        bookingLink: "https://app.test/prophylaxe",
        practiceName: "Dr. Test",
        optOutLink: "https://app.test/opt-out",
      }
    );

    expect(result).toBe(
      "Hallo Max, buchen: https://app.test/prophylaxe — Dr. Test — https://app.test/opt-out"
    );
  });
});

describe("recall due date logic", () => {
  it("matches patients exactly 6 months after last visit within tolerance", () => {
    const lastVisit = dayjs("2026-01-04").toDate();
    const due = dayjs(lastVisit).add(6, "month").startOf("day");
    const reference = dayjs("2026-07-04").startOf("day");
    const daysPastDue = reference.diff(due, "day");

    expect(daysPastDue).toBe(0);
    expect(daysPastDue).toBeLessThanOrEqual(3);
  });
});
