import { randomUUID } from "node:crypto";

import { assertProductionProvider } from "../production-config";
import { createDentalLogger } from "../resilience/dental-logger";
import { RECALL_ENV } from "./constants";
import type { RecallEmailPayload, RecallEmailTransport } from "./recall-email-transport.interface";
import { NodemailerRecallEmailTransport } from "./nodemailer-recall-email-transport";

const mockLog = createDentalLogger({ module: "recall-mock-email" });

/**
 * Development transport — logs recall emails instead of sending.
 */
export class MockRecallEmailTransport implements RecallEmailTransport {
  async send(payload: RecallEmailPayload): Promise<{ messageId: string }> {
    const messageId = `mock_recall_${randomUUID()}`;

    if (process.env.RECALL_MOCK_EMAIL_LOG !== "false") {
      mockLog.info("Mock recall email", {
        to: payload.to,
        subject: payload.subject,
        messageId,
      });
    }

    return { messageId };
  }
}

export function createRecallEmailTransport(): RecallEmailTransport {
  const provider = process.env[RECALL_ENV.EMAIL_PROVIDER] ?? "mock";
  assertProductionProvider(provider, RECALL_ENV.EMAIL_PROVIDER, ["nodemailer"]);

  if (provider === "mock") {
    return new MockRecallEmailTransport();
  }

  if (provider === "nodemailer") {
    return new NodemailerRecallEmailTransport();
  }

  throw new Error(`Unsupported RECALL_EMAIL_PROVIDER: ${provider}`);
}
