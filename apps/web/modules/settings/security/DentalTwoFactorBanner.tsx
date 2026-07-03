import Link from "next/link";

import { TopBanner } from "@calcom/ui/components/top-banner";

export function DentalTwoFactorBanner() {
  return (
    <TopBanner
      text="Für Praxisinhaber und Administratoren ist Zwei-Faktor-Authentifizierung erforderlich — bitte jetzt einrichten."
      variant="warning"
      actions={
        <Link href="/settings/security/two-factor-auth" className="border-b border-b-black font-medium">
          2FA aktivieren
        </Link>
      }
    />
  );
}
