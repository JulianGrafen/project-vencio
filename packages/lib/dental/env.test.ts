import { describe, expect, it } from "vitest";

import { parseBooleanEnv } from "./env";

describe("env", () => {
  it("parseBooleanEnv accepts true and 1", () => {
    expect(parseBooleanEnv("true")).toBe(true);
    expect(parseBooleanEnv("1")).toBe(true);
    expect(parseBooleanEnv("false")).toBe(false);
    expect(parseBooleanEnv(undefined)).toBe(false);
  });
});
