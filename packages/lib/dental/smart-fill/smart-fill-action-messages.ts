import type { SmartFillInviteActionResult } from "./smart-fill-invite-action.service";

export type SmartFillActionPage = { title: string; body: string; status?: number };

export function missingSmartFillTokenPage(action: "confirm" | "decline"): SmartFillActionPage {
  return {
    title: action === "confirm" ? "Bestätigung" : "Ablehnung",
    body: "Der Link ist ungültig.",
    status: 400,
  };
}

export function mapConfirmResultToPage(result: SmartFillInviteActionResult): SmartFillActionPage {
  if (result.success && result.action === "confirmed") {
    return {
      title: "Termin bestätigt",
      body: `Hallo ${result.patientName}, Ihr Nachrücktermin ist bestätigt. Sie erhalten in Kürze eine Kalendereinladung per E-Mail.`,
    };
  }

  const message =
    result.success === false && result.reason === "already_handled"
      ? "Dieser Termin wurde bereits bestätigt."
      : result.success === false && result.reason === "expired"
        ? "Der Termin ist leider nicht mehr verfügbar."
        : "Der Bestätigungslink ist ungültig oder abgelaufen.";

  return { title: "Terminbestätigung", body: message };
}

export function mapDeclineResultToPage(result: SmartFillInviteActionResult): SmartFillActionPage {
  if (result.success && result.action === "declined") {
    return {
      title: "Termin abgelehnt",
      body: `Hallo ${result.patientName}, Sie haben den freien Termin abgelehnt. Vielen Dank für Ihre Rückmeldung.`,
    };
  }

  const message =
    result.success === false && result.reason === "already_handled"
      ? "Sie haben dieses Angebot bereits abgelehnt."
      : "Der Link ist ungültig oder abgelaufen.";

  return { title: "Termin abgelehnt", body: message };
}
