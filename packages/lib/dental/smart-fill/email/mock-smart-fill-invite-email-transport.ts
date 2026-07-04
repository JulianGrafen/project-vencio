import { randomUUID } from "node:crypto";

import { assertProductionProvider } from "../../production-config";
import { createDentalLogger } from "../../resilience/dental-logger";
import { SMART_FILL_ENV } from "../constants";
import type {
  SmartFillInviteEmailPayload,
  SmartFillInviteEmailTransport,
} from "./smart-fill-invite-email-transport.interface";
import { NodemailerSmartFillInviteEmailTransport } from "./nodemailer-smart-fill-invite-email-transport";

const mockLog = createDentalLogger({ module: "smart-fill-mock-email" });

export class MockSmartFillInviteEmailTransport implements SmartFillInviteEmailTransport {
  async send(payload: SmartFillInviteEmailPayload): Promise<{ messageId: string }> {
    const messageId = `mock_sf_${randomUUID()}`;

    if (process.env[SMART_FILL_ENV.MOCK_EMAIL_LOG] !== "false") {
      mockLog.info("Mock Smart-Fill invite email", {
        to: payload.to,
        subject: payload.subject,
        messageId,
      });
    }

    return { messageId };
  }
}

export function createSmartFillInviteEmailTransport(): SmartFillInviteEmailTransport {
  const provider = process.env[SMART_FILL_ENV.EMAIL_PROVIDER] ?? "mock";
  assertProductionProvider(provider, SMART_FILL_ENV.EMAIL_PROVIDER, ["nodemailer"]);

  if (provider === "mock") {
    return new MockSmartFillInviteEmailTransport();
  }

  if (provider === "nodemailer") {
    return new NodemailerSmartFillInviteEmailTransport();
  }

  throw new Error(`Unsupported SMART_FILL_EMAIL_PROVIDER: ${provider}`);
}
