import type { MedicalCategory } from "@calcom/prisma/enums";
import type { IconName } from "@calcom/ui/components/icon";

/** Presentation-only mapping — domain definitions stay UI-free in @calcom/lib/dental. */
export const MEDICAL_CATEGORY_ICONS: Record<MedicalCategory, IconName> = {
  SCHMERZBEHANDLUNG: "zap",
  PROPHYLAXE: "sparkles",
  KONTROLLE: "circle-check",
  FUELLUNG: "shield-check",
  IMPLANTOLOGIE: "atom",
  KIEFERORTHOPAEDIE: "activity",
  SONSTIGES: "calendar",
};
