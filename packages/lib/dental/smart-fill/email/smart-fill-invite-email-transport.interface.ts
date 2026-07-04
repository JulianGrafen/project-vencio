export type SmartFillInviteEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export interface SmartFillInviteEmailTransport {
  send(payload: SmartFillInviteEmailPayload): Promise<{ messageId: string }>;
}
