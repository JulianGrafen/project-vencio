import type { NextRequest } from "next/server";

import { dentalHtmlResponse } from "@calcom/lib/dental/html-response";
import {
  mapConfirmResultToPage,
  mapDeclineResultToPage,
  missingSmartFillTokenPage,
} from "@calcom/lib/dental/smart-fill/smart-fill-action-messages";
import { SmartFillInviteActionService } from "@calcom/lib/dental/smart-fill/smart-fill-invite-action.service";
import { prisma } from "@calcom/prisma";

export async function handleSmartFillTokenAction(request: NextRequest, action: "confirm" | "decline") {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    const page = missingSmartFillTokenPage(action);
    return dentalHtmlResponse(page.title, page.body, page.status ?? 400);
  }

  const service = new SmartFillInviteActionService(prisma);
  const result =
    action === "confirm" ? await service.confirmByToken(token) : await service.declineByToken(token);

  const page = action === "confirm" ? mapConfirmResultToPage(result) : mapDeclineResultToPage(result);
  return dentalHtmlResponse(page.title, page.body, page.status ?? 200);
}
