import type { IdentityProvider } from "@calcom/prisma/enums";

import { isDentalTwoFactorSetupRequiredForUser } from "./two-factor-policy";

export class DentalTwoFactorRequiredError extends Error {
  constructor() {
    super(
      "Zwei-Faktor-Authentifizierung ist für Praxis-Administratoren erforderlich. Bitte aktivieren Sie 2FA unter Einstellungen → Sicherheit."
    );
    this.name = "DentalTwoFactorRequiredError";
  }
}

export async function assertDentalTwoFactorEnabledForUser(user: {
  id: number;
  twoFactorEnabled: boolean;
  identityProvider: IdentityProvider;
}): Promise<void> {
  const setupRequired = await isDentalTwoFactorSetupRequiredForUser(user);

  if (setupRequired) {
    throw new DentalTwoFactorRequiredError();
  }
}
