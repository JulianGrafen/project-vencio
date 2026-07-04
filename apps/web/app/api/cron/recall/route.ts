import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { RecallCronService } from "@calcom/lib/dental/recall";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { prisma } from "@calcom/prisma";

/**
 * Vercel Cron — runs daily.
 * Sends prophylaxis recall emails/SMS for patients due after configured interval.
 */
async function postHandler(request: NextRequest) {
  const apiKey = request.headers.get("authorization") || request.nextUrl.searchParams.get("apiKey");

  if (process.env.CRON_API_KEY !== apiKey && `Bearer ${process.env.CRON_SECRET}` !== apiKey) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!isRecallEnabled()) {
    return NextResponse.json({ message: "Recall disabled", skipped: true });
  }

  const service = new RecallCronService(prisma);
  const result = await service.run();

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
