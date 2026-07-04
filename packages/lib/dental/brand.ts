import { DENTAL_ENV, parseBooleanEnv } from "./env";

/** Default product name for dental compliance deployments. */
export const DENTAL_PRODUCT_NAME = "teeth.al";

/**
 * Resolves the user-facing product name for auth, PWA manifest, and emails.
 * Prefers explicit NEXT_PUBLIC_APP_NAME, then teeth.al in compliance mode.
 */
export function resolveDentalBrandName(fallback = "Cal.diy"): string {
  const explicit = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  if (explicit) {
    return explicit;
  }

  if (
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_COMPLIANCE_MODE]) ||
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_ENCRYPTION_ENABLED]) ||
    parseBooleanEnv(process.env[DENTAL_ENV.ENCRYPTION_ENABLED])
  ) {
    return DENTAL_PRODUCT_NAME;
  }

  return fallback;
}
