import { serverConfig } from "@calcom/lib/serverConfig";

import type {
  SmartFillInviteEmailPayload,
  SmartFillInviteEmailTransport,
} from "./smart-fill-invite-email-transport.interface";

/** Production Smart-Fill invite transport via Cal.com SMTP config. */
export class NodemailerSmartFillInviteEmailTransport implements SmartFillInviteEmailTransport {
  async send(payload: SmartFillInviteEmailPayload): Promise<{ messageId: string }> {
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
