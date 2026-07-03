import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SmartFillReplyHandler } from "@calcom/lib/dental/smart-fill";
import { prisma } from "@calcom/prisma";

type TwilioFormPayload = {
  From?: string;
  Body?: string;
  MessageSid?: string;
};

/**
 * Inbound SMS/WhatsApp webhook (Twilio-compatible form body or JSON mock).
 * Patient replies "JA" → booking confirmed automatically.
 */
async function postHandler(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  let from: string | undefined;
  let body: string | undefined;
  let messageSid: string | undefined;

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as { from?: string; body?: string; messageSid?: string };
    from = json.from;
    body = json.body;
    messageSid = json.messageSid;
  } else {
    const form = await request.formData();
    from = (form.get("From") as string | null) ?? undefined;
    body = (form.get("Body") as string | null) ?? undefined;
    messageSid = (form.get("MessageSid") as string | null) ?? undefined;
  }

  if (!from || !body) {
    return NextResponse.json({ error: "Missing from/body" }, { status: 400 });
  }

  const handler = new SmartFillReplyHandler(prisma);
  const result = await handler.handleInboundSms({ from, body, messageSid });

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
