import {
  getOffice365AppKeysFromEnv,
  parseGoogleApiCredentialsFromEnv,
} from "@calcom/app-store/_utils/parseGoogleApiCredentials";

import { WEBAPP_URL } from "../constants";

export type CalendarReadinessCheck = {
  id: string;
  ok: boolean;
  message: string;
};

export type CalendarReadiness = {
  ready: boolean;
  checks: CalendarReadinessCheck[];
};

function check(id: string, ok: boolean, message: string): CalendarReadinessCheck {
  return { id, ok, message };
}

export function validateCalendarOAuthReadiness(): CalendarReadiness {
  const checks: CalendarReadinessCheck[] = [];
  const googleKeys = parseGoogleApiCredentialsFromEnv();
  const office365Keys = getOffice365AppKeysFromEnv();
  const expectedGoogleRedirect = `${WEBAPP_URL}/api/integrations/googlecalendar/callback`;
  const expectedOffice365Redirect = `${WEBAPP_URL}/api/integrations/office365calendar/callback`;

  if (!googleKeys && !office365Keys) {
    checks.push(
      check(
        "calendar-oauth",
        false,
        "No calendar OAuth credentials configured. Set GOOGLE_API_CREDENTIALS (and optionally MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET) in Vercel."
      )
    );
  }

  if (googleKeys) {
    const redirectMatches = googleKeys.redirect_uris.some((uri) => uri === expectedGoogleRedirect);
    checks.push(
      check(
        "google-oauth",
        true,
        "GOOGLE_API_CREDENTIALS is configured."
      ),
      check(
        "google-redirect-uri",
        redirectMatches,
        redirectMatches
          ? `Google redirect URI matches ${expectedGoogleRedirect}.`
          : `Google OAuth redirect URI must include ${expectedGoogleRedirect} in GOOGLE_API_CREDENTIALS.redirect_uris and in Google Cloud Console.`
      )
    );
  }

  if (office365Keys) {
    checks.push(
      check(
        "office365-oauth",
        true,
        "Microsoft calendar OAuth is configured. Ensure redirect URI " +
          `${expectedOffice365Redirect} is registered in Azure.`
      )
    );
  }

  if (checks.length === 0) {
    checks.push(
      check(
        "calendar-oauth",
        true,
        "Apple Calendar and CalDAV are available without OAuth credentials."
      )
    );
  }

  const oauthChecks = checks.filter((item) => item.id !== "calendar-oauth" || !item.ok);
  const ready = oauthChecks.every((item) => item.ok);

  return { ready, checks };
}
