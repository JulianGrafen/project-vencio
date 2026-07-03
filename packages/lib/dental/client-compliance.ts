/**
 * Client-side compliance flags (NEXT_PUBLIC_* only — safe for browser bundles).
 */
export function isDentalClientComplianceMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE === "true" ||
    process.env.NEXT_PUBLIC_DENTAL_ENCRYPTION_ENABLED === "true"
  );
}

export function isDentalClientTrackingDisabled(): boolean {
  return (
    isDentalClientComplianceMode() || process.env.NEXT_PUBLIC_DENTAL_DISABLE_TRACKING === "true"
  );
}

export function isDentalClientAnalyticsDisabled(): boolean {
  return (
    isDentalClientComplianceMode() ||
    process.env.NEXT_PUBLIC_DENTAL_DISABLE_THIRD_PARTY_ANALYTICS === "true"
  );
}
