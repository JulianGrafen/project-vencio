import { serverConfig } from "@calcom/lib/serverConfig";

import type { RecallEmailPayload, RecallEmailTransport } from "./recall-email-transport.interface";

/**
 * Production recall email transport using the same SMTP config as Cal.com.
 */
export class NodemailerRecallEmailTransport implements RecallEmailTransport {
  async send(payload: RecallEmailPayload): Promise<{ messageId: string }> {
    const { createTransport } = await import("nodemailer");
    const transport = createTransport(serverConfig.transport);

    const info = await transport.sendMail({
      from: serverConfig.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    return { messageId: String(info.messageId ?? "") };
  }
}
