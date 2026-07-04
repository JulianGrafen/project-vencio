import {
  PRACTICE_TRIAL_DEFAULT_UPGRADE_EMAIL,
  PRACTICE_TRIAL_ENV,
} from "./trial.constants";

export type PracticeTrialUpgradeAction = {
  href: string;
  label: string;
  external: boolean;
};

export function resolvePracticeTrialUpgradeAction(
  env: NodeJS.ProcessEnv = process.env
): PracticeTrialUpgradeAction {
  const checkoutUrl = env[PRACTICE_TRIAL_ENV.UPGRADE_CHECKOUT_URL]?.trim();
  if (checkoutUrl) {
    return {
      href: checkoutUrl,
      label: "Jetzt upgraden",
      external: true,
    };
  }

  const email = env[PRACTICE_TRIAL_ENV.UPGRADE_EMAIL]?.trim() || PRACTICE_TRIAL_DEFAULT_UPGRADE_EMAIL;
  return {
    href: `mailto:${email}?subject=${encodeURIComponent("Upgrade PraxisTermin")}`,
    label: "Upgrade anfragen",
    external: false,
  };
}
