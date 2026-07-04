import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { escapeHtml } from "@calcom/lib/dental/html-escape";
import { RecallOptOutService } from "@calcom/lib/dental/recall";
import { prisma } from "@calcom/prisma";

const OPT_OUT_INVALID_MESSAGE =
  "Der Abmelde-Link ist ungültig oder wurde bereits verwendet.";

function optOutHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;max-width:480px;margin:48px auto;padding:24px;">
  <h1 style="color:#0d9488;font-size:20px;">${escapeHtml(title)}</h1>
  <p style="line-height:1.6;color:#333;">${escapeHtml(body)}</p>
</body></html>`;
}

/**
 * DSGVO one-click opt-out from recall emails.
 * GET /api/recall/opt-out?token=...
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(optOutHtml("Abmeldung", OPT_OUT_INVALID_MESSAGE), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const service = new RecallOptOutService(prisma);
  const result = await service.optOutByToken(token);

  if (!result.success) {
    const message =
      result.reason === "already_opted_out"
        ? "Sie haben Erinnerungen bereits abbestellt."
        : OPT_OUT_INVALID_MESSAGE;

    return new NextResponse(optOutHtml("Abmeldung", message), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new NextResponse(
    optOutHtml(
      "Erinnerungen abbestellt",
      `Hallo ${result.patientName}, Sie erhalten keine weiteren Prophylaxe-Erinnerungen per E-Mail oder SMS.`
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
