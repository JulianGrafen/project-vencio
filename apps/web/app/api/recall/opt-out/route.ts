import type { NextRequest } from "next/server";

import { dentalHtmlResponse } from "@calcom/lib/dental/html-response";
import { RecallOptOutService } from "@calcom/lib/dental/recall";
import { prisma } from "@calcom/prisma";

const OPT_OUT_INVALID_MESSAGE =
  "Der Abmelde-Link ist ungültig oder wurde bereits verwendet.";

/**
 * DSGVO one-click opt-out from recall emails.
 * GET /api/recall/opt-out?token=...
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return dentalHtmlResponse("Abmeldung", OPT_OUT_INVALID_MESSAGE, 400);
  }

  const service = new RecallOptOutService(prisma);
  const result = await service.optOutByToken(token);

  if (!result.success) {
    const message =
      result.reason === "already_opted_out"
        ? "Sie haben Erinnerungen bereits abbestellt."
        : OPT_OUT_INVALID_MESSAGE;

    return dentalHtmlResponse("Abmeldung", message);
  }

  return dentalHtmlResponse(
    "Erinnerungen abbestellt",
    `Hallo ${result.patientName}, Sie erhalten keine weiteren Prophylaxe-Erinnerungen per E-Mail oder SMS.`
  );
}
