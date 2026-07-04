import { describe, expect, it } from "vitest";

import { isTrialExemptPath, shouldRedirectExpiredTrialToUpgrade } from "./trial-guard";

describe("trial-guard", () => {
  it("allows upgrade and auth paths when trial expired", () => {
    expect(isTrialExemptPath("/upgrade")).toBe(true);
    expect(isTrialExemptPath("/auth/login")).toBe(true);
    expect(isTrialExemptPath("/settings/my-account/general")).toBe(true);
  });

  it("redirects dashboard paths when trial expired", () => {
    expect(shouldRedirectExpiredTrialToUpgrade("/event-types", true)).toBe(true);
    expect(shouldRedirectExpiredTrialToUpgrade("/bookings/upcoming", true)).toBe(true);
  });

  it("does not redirect when trial is active", () => {
    expect(shouldRedirectExpiredTrialToUpgrade("/event-types", false)).toBe(false);
  });
});
