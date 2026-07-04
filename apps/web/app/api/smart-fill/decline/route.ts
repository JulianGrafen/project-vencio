import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { escapeHtml } from "@calcom/lib/dental/html-escape";
import { SmartFillInviteActionService } from "@calcom/lib/dental/smart-fill/smart-fill-invite-action.service";
import { prisma } from "@calcom/prisma";

function responseHtml(title: string, body: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;max-width:480px;margin:48px auto;padding:24px;">
  <h1 style="color:#0d9488;font-size:20px;">${escapeHtml(title)}</h1>
  <p style="line-height:1.6;color:#333;">${escapeHtml(body)}</p>
</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/**
 * Decline a Smart-Fill backfill offer from email link.
 * GET /api/smart-fill/decline?token=...
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return responseHtml("Ablehnung", "Der Link ist ungültig.", 400);
  }

  const service = new SmartFillInviteActionService(prisma);
  const result = await service.declineByToken(token);

  if (!result.success) {
    const message =
      result.reason === "already_handled"
        ? "Sie haben dieses Angebot bereits abgelehnt."
        : "Der Link ist ungültig oder abgelaufen.";

    return responseHtml("Termin abgelehnt", message);
  }

  return responseHtml(
    "Termin abgelehnt",
    `Hallo ${result.patientName}, Sie haben den freien Termin abgelehnt. Vielen Dank für Ihre Rückmeldung.`
  );
}
