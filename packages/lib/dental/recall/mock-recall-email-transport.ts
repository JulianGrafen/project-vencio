import { randomUUID } from "node:crypto";

import type { RecallEmailPayload, RecallEmailTransport } from "./recall-email-transport.interface";

/**
 * Development transport — logs recall emails instead of sending.
 */
export class MockRecallEmailTransport implements RecallEmailTransport {
  async send(payload: RecallEmailPayload): Promise<{ messageId: string }> {
    const messageId = `mock_recall_${randomUUID()}`;

    if (process.env.RECALL_MOCK_EMAIL_LOG !== "false") {
      console.info("[Recall MockEmail]", {
        to: payload.to,
        subject: payload.subject,
        messageId,
      });
    }

    return { messageId };
  }
}

export function createRecallEmailTransport(): RecallEmailTransport {
  const provider = process.env.RECALL_EMAIL_PROVIDER ?? "mock";

  if (provider === "mock") {
    return new MockRecallEmailTransport();
  }

  if (provider === "nodemailer") {
    // Lazy import to keep unit tests free of SMTP deps when mocked
    const { NodemailerRecallEmailTransport } = require("./nodemailer-recall-email-transport") as {
      NodemailerRecallEmailTransport: new () => RecallEmailTransport;
    };
    return new NodemailerRecallEmailTransport();
  }

  throw new Error(`Unsupported RECALL_EMAIL_PROVIDER: ${provider}`);
}
