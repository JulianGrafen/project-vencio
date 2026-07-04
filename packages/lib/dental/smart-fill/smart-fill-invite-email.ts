import dayjs from "@calcom/dayjs";
import { WEBAPP_URL } from "@calcom/lib/constants";

import { DENTAL_BRAND_TEAL } from "../constants";
import { escapeHtml } from "../html-escape";
import { SMART_FILL_DEFAULT_TREATMENT_TITLE } from "./constants";

type InviteEmailParams = {
  patientName: string;
  patientEmail: string;
  slotStart: Date;
  timeZone: string;
  treatmentTitle?: string | null;
  practiceName?: string | null;
  confirmToken: string;
};

function buildActionUrl(path: "confirm" | "decline", token: string): string {
  const base = WEBAPP_URL.replace(/\/$/, "");
  return `${base}/api/smart-fill/${path}?token=${encodeURIComponent(token)}`;
}

export function buildSmartFillInviteEmail(params: InviteEmailParams) {
  const treatment = escapeHtml(params.treatmentTitle ?? SMART_FILL_DEFAULT_TREATMENT_TITLE);
  const practice = escapeHtml(params.practiceName ?? "Ihrer Zahnarztpraxis");
  const patientName = escapeHtml(params.patientName);
  const startFormatted = escapeHtml(
    dayjs(params.slotStart).tz(params.timeZone).format("dddd, DD.MM.YYYY [um] HH:mm")
  );

  const confirmUrl = buildActionUrl("confirm", params.confirmToken);
  const declineUrl = buildActionUrl("decline", params.confirmToken);

  const subject = `Freier Termin am ${dayjs(params.slotStart).tz(params.timeZone).format("DD.MM.")} — ${practice}`;

  const text = [
    `Guten Tag ${params.patientName},`,
    "",
    `in ${practice} ist am ${startFormatted} ein Termin frei geworden (${treatment}).`,
    "",
    `Termin bestätigen: ${confirmUrl}`,
    `Termin ablehnen: ${declineUrl}`,
    "",
    "Mit freundlichen Grüßen",
    practice,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="de">
<body style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#333;">
  <p>Guten Tag ${patientName},</p>
  <p>in <strong>${practice}</strong> ist am <strong>${startFormatted}</strong> ein Termin frei geworden (${treatment}).</p>
  <p style="margin:28px 0;">
    <a href="${confirmUrl}" style="background:${DENTAL_BRAND_TEAL};color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;margin-right:12px;">Termin bestätigen</a>
    <a href="${declineUrl}" style="color:#666;text-decoration:underline;">Ablehnen</a>
  </p>
  <p style="color:#666;font-size:13px;">Falls die Buttons nicht funktionieren, kopieren Sie diesen Link: ${confirmUrl}</p>
</body>
</html>`;

  return { to: params.patientEmail, subject, html, text };
}

export function buildSmartFillInviteConfirmLinks(token: string) {
  return {
    confirmUrl: buildActionUrl("confirm", token),
    declineUrl: buildActionUrl("decline", token),
  };
}
