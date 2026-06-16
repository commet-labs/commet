import crypto from "node:crypto";
import type { ApiResponse, RequestOptions } from "../types/common";
import type { SubscriptionStatus } from "../types/enums";
import type {
  WebhookEvent,
  WebhookEventDataMap,
  WebhookEventPayload,
} from "../types/webhook-events";
import type { CommetHTTPClient } from "../utils/http";

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  organizationId: string;
  mode: "live" | "sandbox";
  apiVersion: string;
  data: WebhookData;
}

export interface WebhookData {
  publicId?: string;
  subscriptionId?: string;
  customerId?: string;
  status?: SubscriptionStatus;
  name?: string;
  canceledAt?: string;
  [key: string]: unknown;
}

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

export interface WebhookEndpoint {
  id: string;
  object: "webhook";
  livemode: boolean;
  url: string;
  events: string[];
  description: string | null;
  isActive: boolean;
  apiVersion: string | null;
  createdAt: string;
}

export interface WebhookEndpointCreated extends WebhookEndpoint {
  secretKey: string;
}

export interface WebhookTestResult {
  success: boolean;
  deliveryId: string;
  deliveredAt: string;
}

export interface ListWebhooksParams {
  limit?: number;
  cursor?: string;
}

export interface CreateWebhookParams {
  url: string;
  events: string[];
  description?: string;
  apiVersion?: string;
}

export interface GetWebhookParams {
  id: string;
}

export interface UpdateWebhookParams {
  id: string;
  url?: string;
  events?: string[];
  description?: string | null;
  isActive?: boolean;
  apiVersion?: string;
}

export interface DeleteWebhookParams {
  id: string;
}

export interface TestWebhookParams {
  id: string;
}

export class Webhooks {
  private readonly eventHandlers = new Map<
    WebhookEvent,
    WebhookEventHandler<WebhookEvent>
  >();

  constructor(private httpClient?: CommetHTTPClient) {}

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

  async list(
    params?: ListWebhooksParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<WebhookEndpoint[]>> {
    return this.httpClient!.get("/webhooks", params, options);
  }

  async create(
    params: CreateWebhookParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<WebhookEndpointCreated>> {
    return this.httpClient!.post("/webhooks", params, options);
  }

  async get(
    params: GetWebhookParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<WebhookEndpoint>> {
    const { id } = params;
    return this.httpClient!.get(`/webhooks/${id}`, undefined, options);
  }

  async update(
    params: UpdateWebhookParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<WebhookEndpoint>> {
    const { id, ...body } = params;
    return this.httpClient!.put(`/webhooks/${id}`, body, options);
  }

  async delete(
    params: DeleteWebhookParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ id: string; deleted: true }>> {
    const { id } = params;
    return this.httpClient!.delete(`/webhooks/${id}`, undefined, options);
  }

  async test(
    params: TestWebhookParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<WebhookTestResult>> {
    const { id } = params;
    return this.httpClient!.post(`/webhooks/${id}/test`, undefined, options);
  }
}
