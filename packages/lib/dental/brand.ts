import { parseBooleanEnv } from "./env";

/** Default product name for dental compliance deployments. */
export const DENTAL_PRODUCT_NAME = "teeth.al";

/**
 * Resolves the user-facing product name for auth, PWA manifest, and emails.
 * Prefers explicit NEXT_PUBLIC_APP_NAME, then teeth.al in compliance mode.
 */
export function resolveDentalBrandName(fallback = DENTAL_PRODUCT_NAME): string {
  const explicit = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  if (explicit) {
    return explicit;
  }

  if (
    parseBooleanEnv(process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE) ||
    parseBooleanEnv(process.env.NEXT_PUBLIC_DENTAL_ENCRYPTION_ENABLED) ||
    parseBooleanEnv(process.env.DENTAL_ENCRYPTION_ENABLED)
  ) {
    return DENTAL_PRODUCT_NAME;
  }

  return fallback;
}
