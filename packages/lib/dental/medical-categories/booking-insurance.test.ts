import { describe, expect, it, vi } from "vitest";

import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";

import {
  assertInsuranceAllowedForEventType,
  extractInsuranceTypeFromResponses,
} from "./booking-insurance";

function buildDb(profile: { allowedInsuranceTypes: string[] } | null) {
  return {
    eventTypeMedicalProfile: {
      findUnique: vi.fn(async () => profile),
    },
  };
}

describe("extractInsuranceTypeFromResponses", () => {
  it("extracts a valid insurance type", () => {
    expect(extractInsuranceTypeFromResponses({ insuranceType: "PRIVAT" })).toBe("PRIVAT");
  });

  it.each([null, undefined, "PRIVAT", { insuranceType: "UNKNOWN" }, {}])(
    "returns null for invalid responses %p",
    (responses) => {
      expect(extractInsuranceTypeFromResponses(responses)).toBeNull();
    }
  );
});

describe("assertInsuranceAllowedForEventType", () => {
  it("passes when no medical profile exists", async () => {
    const db = buildDb(null);

    await expect(
      assertInsuranceAllowedForEventType(db as never, 1, "GESETZLICH")
    ).resolves.toBeUndefined();
  });

  it("passes when the allow-list is empty", async () => {
    const db = buildDb({ allowedInsuranceTypes: [] });

    await expect(assertInsuranceAllowedForEventType(db as never, 1, "PRIVAT")).resolves.toBeUndefined();
  });

  it("passes when the insurance type is listed", async () => {
    const db = buildDb({ allowedInsuranceTypes: ["PRIVAT", "SELBSTZAHLER"] });

    await expect(assertInsuranceAllowedForEventType(db as never, 1, "PRIVAT")).resolves.toBeUndefined();
  });

  it("throws a typed BadRequest error when the insurance type is excluded", async () => {
    const db = buildDb({ allowedInsuranceTypes: ["PRIVAT"] });

    const act = assertInsuranceAllowedForEventType(db as never, 42, "GESETZLICH");

    await expect(act).rejects.toBeInstanceOf(ErrorWithCode);
    await expect(act).rejects.toMatchObject({ code: ErrorCode.BadRequest });
  });
});
