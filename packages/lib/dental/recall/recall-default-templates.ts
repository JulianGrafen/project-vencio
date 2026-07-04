import { RECALL_TEMPLATE_VARIABLES } from "./constants";

export const DEFAULT_RECALL_EMAIL_SUBJECT = "Zeit für Ihre Prophylaxe bei [PraxisName]";

export const DEFAULT_RECALL_EMAIL_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Prophylaxe-Erinnerung</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#14b8a6);padding:28px 32px;">
              <p style="margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Ihre Zahngesundheit</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;">Zeit für Ihre Prophylaxe</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Guten Tag ${RECALL_TEMPLATE_VARIABLES.PATIENT_NAME},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                Ihr letzter Besuch bei uns liegt etwa <strong>6 Monate</strong> zurück. Für gesunde Zähne empfehlen wir eine regelmäßige professionelle Zahnreinigung.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                Buchen Sie jetzt bequem online Ihren nächsten Termin:
              </p>
              <p style="margin:0 0 28px;text-align:center;">
                <a href="${RECALL_TEMPLATE_VARIABLES.BOOKING_LINK}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;border-radius:8px;">Termin online buchen</a>
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
                Mit freundlichen Grüßen<br />
                <strong>${RECALL_TEMPLATE_VARIABLES.PRACTICE_NAME}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f8faf9;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                Sie möchten keine weiteren Erinnerungen erhalten?
                <a href="${RECALL_TEMPLATE_VARIABLES.OPT_OUT_LINK}" style="color:#0d9488;">Hier abmelden</a> (DSGVO-konform).
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const DEFAULT_RECALL_EMAIL_TEXT = `Guten Tag ${RECALL_TEMPLATE_VARIABLES.PATIENT_NAME},

Ihr letzter Besuch bei uns liegt etwa 6 Monate zurück. Für gesunde Zähne empfehlen wir eine regelmäßige professionelle Zahnreinigung.

Termin online buchen: ${RECALL_TEMPLATE_VARIABLES.BOOKING_LINK}

Mit freundlichen Grüßen
${RECALL_TEMPLATE_VARIABLES.PRACTICE_NAME}

---
Keine weiteren Erinnerungen? Abmelden: ${RECALL_TEMPLATE_VARIABLES.OPT_OUT_LINK}`;

export const DEFAULT_RECALL_SMS_TEMPLATE = `Guten Tag [PatientenName], Zeit für Ihre Prophylaxe bei [PraxisName]. Buchen: [TerminLink]`;
