import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SmartFillCronService } from "@calcom/lib/dental/smart-fill";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { prisma } from "@calcom/prisma";

/**
 * Vercel Cron — runs every 6 hours.
 * Scans calendars for Smart-Fill candidate slots and sends patient SMS invites.
 */
async function postHandler(request: NextRequest) {
  const apiKey = request.headers.get("authorization") || request.nextUrl.searchParams.get("apiKey");

  if (process.env.CRON_API_KEY !== apiKey && `Bearer ${process.env.CRON_SECRET}` !== apiKey) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!isSmartFillEnabled()) {
    return NextResponse.json({ message: "Smart-Fill disabled", skipped: true });
  }

  const service = new SmartFillCronService(prisma);
  const result = await service.run();

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
