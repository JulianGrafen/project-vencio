import { isDentalClientComplianceMode } from "../compliance-config";
import { MEDICAL_TRUST_COLORS } from "../theme/medical-trust-colors";

/** DOM attribute that activates medical-trust-theme.css on booking surfaces. */
export const DENTAL_BOOKER_DATA_ATTRIBUTE = "data-teeth-al-booker";

export function isDentalBookerThemeEnabled(): boolean {
  return isDentalClientComplianceMode();
}

export function getDentalBookerRootProps(): Record<string, string> | undefined {
  if (!isDentalBookerThemeEnabled()) {
    return undefined;
  }
  return { [DENTAL_BOOKER_DATA_ATTRIBUTE]: "true" };
}

/** Brand colors passed to useBrandColors() when dental compliance mode is active. */
export function getDentalBookerBrandColors(): { brandColor: string; darkBrandColor: string } {
  return {
    brandColor: MEDICAL_TRUST_COLORS.primary,
    darkBrandColor: MEDICAL_TRUST_COLORS.primaryEmphasis,
  };
}
