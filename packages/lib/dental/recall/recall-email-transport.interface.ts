export type RecallEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export interface RecallEmailTransport {
  send(payload: RecallEmailPayload): Promise<{ messageId: string }>;
}
