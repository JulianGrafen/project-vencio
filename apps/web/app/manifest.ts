import type { MetadataRoute } from "next";

import { resolveDentalBrandName } from "@calcom/lib/dental/brand";
import { MEDICAL_TRUST_COLORS } from "@calcom/lib/dental/theme/medical-trust-colors";

export default function manifest(): MetadataRoute.Manifest {
  const name = resolveDentalBrandName();

  return {
    name,
    short_name: name,
    description: "Terminsoftware für Zahnarztpraxen — DSGVO-konform.",
    icons: [
      {
        src: "/api/logo?type=android-chrome-192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/logo?type=android-chrome-256",
        sizes: "256x256",
        type: "image/png",
      },
    ],
    theme_color: MEDICAL_TRUST_COLORS.background,
    background_color: MEDICAL_TRUST_COLORS.background,
    display_override: ["minimal-ui"],
    display: "standalone",
    scope: "/",
    start_url: "/",
  };
}
