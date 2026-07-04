import { parseBooleanEnv } from "../env";
import { isDentalComplianceMode } from "../compliance-config";
import { PRACTICE_TRIAL_ENV } from "./trial.constants";

/** Practice trial mechanic is on for dental B2B deployments unless explicitly disabled. */
export function isPracticeTrialEnabled(): boolean {
  if (process.env[PRACTICE_TRIAL_ENV.ENABLED] === "false") {
    return false;
  }
  if (parseBooleanEnv(process.env[PRACTICE_TRIAL_ENV.ENABLED])) {
    return true;
  }
  return isDentalComplianceMode();
}
