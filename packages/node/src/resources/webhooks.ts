import crypto from "node:crypto";
import type {
  WebhookEvent,
  WebhookEventDataMap,
  WebhookEventPayload,
} from "../types/webhook-events";

export type WebhookPayload = WebhookEventPayload;
export type WebhookData = WebhookPayload["data"];

export type WebhookEventHandler<E extends WebhookEvent> = (
  data: WebhookEventDataMap[E],
  payload: Extract<WebhookEventPayload, { event: E }>,
) => void | Promise<void>;

export interface VerifyParams {
  payload: string;
  signature: string | null;
  secret: string;
}

export interface GenerateSignatureParams {
  payload: string;
  secret: string;
}

export interface VerifyAndParseParams {
  rawBody: string;
  signature: string | null;
  secret: string;
}

export class Webhooks {
  private readonly eventHandlers = new Map<
    WebhookEvent,
    WebhookEventHandler<WebhookEvent>
  >();

  verify(params: VerifyParams): boolean {
    const { payload, signature, secret } = params;

    if (!signature || !secret || !payload) {
      return false;
    }

    try {
      const expectedSignature = this.generateSignature({ payload, secret });
      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex"),
      );
    } catch (_error) {
      // timingSafeEqual throws when the two buffers differ in length
      return false;
    }
  }

  private generateSignature(params: GenerateSignatureParams): string {
    const { payload, secret } = params;
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
  }

  verifyAndParse(params: VerifyAndParseParams): WebhookPayload | null {
    const { rawBody, signature, secret } = params;

    if (!this.verify({ payload: rawBody, signature, secret })) {
      return null;
    }

    try {
      return JSON.parse(params.rawBody) as WebhookPayload;
    } catch {
      return null;
    }
  }

  on<E extends WebhookEvent>(event: E, handler: WebhookEventHandler<E>): this {
    this.eventHandlers.set(
      event,
      handler as unknown as WebhookEventHandler<WebhookEvent>,
    );
    return this;
  }

  async process(params: VerifyAndParseParams): Promise<WebhookPayload | null> {
    const payload = this.verifyAndParse(params);
    if (!payload) return null;
    const handler = this.eventHandlers.get(payload.event);
    if (handler) await handler(payload.data as never, payload as never);
    return payload;
  }
}
