import type { NextRequest } from "next/server";

import { handleSmartFillTokenAction } from "../_lib/handle-token-action";

/**
 * One-click Smart-Fill booking confirmation from email link.
 * GET /api/smart-fill/confirm?token=...
 */
export async function GET(request: NextRequest) {
  return handleSmartFillTokenAction(request, "confirm");
}
