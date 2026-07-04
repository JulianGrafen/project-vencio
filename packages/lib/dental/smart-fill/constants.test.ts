import { describe, expect, it } from "vitest";

import {
  isSmartFillConfirmKeyword,
  isSmartFillDeclineKeyword,
  SMART_FILL_CONFIRM_KEYWORDS,
  SMART_FILL_DECLINE_KEYWORDS,
} from "./constants";

describe("smart-fill constants", () => {
  it("matches confirm keywords case-insensitively", () => {
    for (const keyword of SMART_FILL_CONFIRM_KEYWORDS) {
      expect(isSmartFillConfirmKeyword(keyword.toLowerCase())).toBe(true);
    }
    expect(isSmartFillConfirmKeyword("J")).toBe(false);
  });

  it("matches decline keywords case-insensitively", () => {
    for (const keyword of SMART_FILL_DECLINE_KEYWORDS) {
      expect(isSmartFillDeclineKeyword(keyword.toLowerCase())).toBe(true);
    }
    expect(isSmartFillDeclineKeyword("JA")).toBe(false);
  });
});
