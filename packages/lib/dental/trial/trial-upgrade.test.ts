import { describe, expect, it } from "vitest";

import { PRACTICE_TRIAL_ENV } from "./trial.constants";
import { resolvePracticeTrialUpgradeAction } from "./trial-upgrade";

describe("resolvePracticeTrialUpgradeAction", () => {
  it("uses checkout URL when configured", () => {
    const action = resolvePracticeTrialUpgradeAction({
      [PRACTICE_TRIAL_ENV.UPGRADE_CHECKOUT_URL]: "https://buy.stripe.com/test-link",
    });

    expect(action).toEqual({
      href: "https://buy.stripe.com/test-link",
      label: "Jetzt upgraden",
      external: true,
    });
  });

  it("falls back to mailto when checkout URL is absent", () => {
    const action = resolvePracticeTrialUpgradeAction({
      [PRACTICE_TRIAL_ENV.UPGRADE_EMAIL]: "sales@praxis.de",
    });

    expect(action.external).toBe(false);
    expect(action.label).toBe("Upgrade anfragen");
    expect(action.href).toContain("mailto:sales@praxis.de");
    expect(action.href).toContain("Upgrade%20PraxisTermin");
  });
});
