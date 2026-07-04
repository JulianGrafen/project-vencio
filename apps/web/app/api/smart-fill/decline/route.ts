import type { NextRequest } from "next/server";

import { handleSmartFillTokenAction } from "../_lib/handle-token-action";

/**
 * Decline a Smart-Fill backfill offer from email link.
 * GET /api/smart-fill/decline?token=...
 */
export async function GET(request: NextRequest) {
  return handleSmartFillTokenAction(request, "decline");
}
