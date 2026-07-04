import { PRACTICE_TRIAL_UPGRADE_PATH } from "./trial.constants";

const TRIAL_EXEMPT_PATH_PREFIXES = [
  PRACTICE_TRIAL_UPGRADE_PATH,
  "/auth",
  "/api",
  "/login",
  "/logout",
  "/signup",
  "/settings/my-account",
  "/settings/security",
  "/onboarding",
] as const;

/** Paths reachable when the practice trial has expired (conversion wall). */
export function isTrialExemptPath(pathname: string): boolean {
  return TRIAL_EXEMPT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function shouldRedirectExpiredTrialToUpgrade(
  pathname: string,
  isExpired: boolean
): boolean {
  if (!isExpired) {
    return false;
  }
  return !isTrialExemptPath(pathname);
}
