import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { RecallOptOutService } from "@calcom/lib/dental/recall";
import { prisma } from "@calcom/prisma";

function optOutHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"/><title>${title}</title></head>
<body style="font-family:Arial,sans-serif;max-width:480px;margin:48px auto;padding:24px;">
  <h1 style="color:#0d9488;font-size:20px;">${title}</h1>
  <p style="line-height:1.6;color:#333;">${body}</p>
</body></html>`;
}

/**
 * DSGVO one-click opt-out from recall emails.
 * GET /api/recall/opt-out?token=...
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(optOutHtml("Ungültiger Link", "Der Abmelde-Link ist ungültig."), {
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
        : "Der Abmelde-Link ist ungültig oder abgelaufen.";
    return new NextResponse(optOutHtml("Abmeldung", message), {
      status: result.reason === "invalid_token" ? 404 : 200,
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
