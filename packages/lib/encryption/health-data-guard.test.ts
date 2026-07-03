import { describe, expect, it } from "vitest";

import {
  assertNoHealthDataInText,
  findHealthDataKeywords,
  HealthDataGuardError,
} from "./health-data-guard";

describe("health-data-guard", () => {
  it("detects German health keywords", () => {
    expect(findHealthDataKeywords("Ich habe starke Zahnschmerzen")).toContain("zahnschmerz");
  });

  it("allows neutral booking text", () => {
    expect(findHealthDataKeywords("Ich möchte einen Kontrolltermin buchen")).toEqual([]);
  });

  it("throws HealthDataGuardError for blocked content", () => {
    expect(() => assertNoHealthDataInText("notes", "Diagnose: Karies")).toThrow(HealthDataGuardError);
  });
});
