import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SmartFillReplyHandler } from "@calcom/lib/dental/smart-fill";
import { resolveTwilioCredentials } from "@calcom/lib/dental/smart-fill/sms/twilio-config";
import {
  formDataToRecord,
  validateTwilioWebhookSignature,
} from "@calcom/lib/dental/smart-fill/sms/validate-twilio-webhook";
import { shouldValidateTwilioSignature } from "@calcom/lib/dental/smart-fill/sms/webhook-auth";
import { prisma } from "@calcom/prisma";

const LEGACY_SMS_WEBHOOK_ENV = "SMART_FILL_SMS_LEGACY_WEBHOOK";

function isLegacySmsWebhookEnabled(): boolean {
  return process.env[LEGACY_SMS_WEBHOOK_ENV] === "true";
}

function deprecatedSmsWebhookResponse() {
  return NextResponse.json(
    {
      error: "deprecated",
      message:
        "Smart-Fill Nachrücktermine use email-only invites. SMS reply webhooks are no longer supported.",
      migrateTo: {
        confirm: "/api/smart-fill/confirm?token=...",
        decline: "/api/smart-fill/decline?token=...",
      },
      legacyEnv: LEGACY_SMS_WEBHOOK_ENV,
    },
    {
      status: 410,
      headers: {
        Deprecation: "true",
        Sunset: "Sat, 04 Jul 2026 00:00:00 GMT",
      },
    }
  );
}

async function postHandler(request: NextRequest) {
  if (!isLegacySmsWebhookEnabled()) {
    return deprecatedSmsWebhookResponse();
  }

  const contentType = request.headers.get("content-type") ?? "";

  let from: string | undefined;
  let body: string | undefined;
  let messageSid: string | undefined;
  let twilioParams: Record<string, string> | undefined;

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as { from?: string; body?: string; messageSid?: string };
    from = json.from;
    body = json.body;
    messageSid = json.messageSid;
    twilioParams = {
      ...(from ? { From: from } : {}),
      ...(body ? { Body: body } : {}),
      ...(messageSid ? { MessageSid: messageSid } : {}),
    };
  } else {
    const form = await request.formData();
    twilioParams = formDataToRecord(form);
    from = twilioParams.From;
    body = twilioParams.Body;
    messageSid = twilioParams.MessageSid;
  }

  if (!from || !body) {
    return NextResponse.json({ error: "Missing from/body" }, { status: 400 });
  }

  if (shouldValidateTwilioSignature(contentType)) {
    const signature = request.headers.get("x-twilio-signature");
    let authToken: string;

    try {
      authToken = resolveTwilioCredentials().authToken;
    } catch {
      return NextResponse.json({ error: "Twilio is not configured" }, { status: 503 });
    }

    const isValid = validateTwilioWebhookSignature({
      authToken,
      signature,
      url: request.url,
      bodyParams: twilioParams ?? {},
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Twilio signature" }, { status: 403 });
    }
  }

  const handler = new SmartFillReplyHandler(prisma);
  const result = await handler.handleInboundSms({ from, body, messageSid });

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
