import type { RequestOptions } from "../types/common";
import type {
  CreatedWebhook,
  DeletedObject,
  Webhook,
  WebhookTest,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";
import { Webhooks } from "./webhooks";

export interface GetWebhookEndpointParams {
  id: string;
}

export interface UpdateWebhookEndpointParams {
  id: string;
  url?: string;
  events?: Array<
    | "subscription.created"
    | "subscription.activated"
    | "subscription.reactivated"
    | "subscription.canceled"
    | "subscription.updated"
    | "subscription.plan_changed"
    | "subscription.cancellation_scheduled"
    | "subscription.cancellation_revoked"
    | "subscription.plan_change_scheduled"
    | "subscription.plan_change_revoked"
    | "subscription.past_due"
    | "trial.started"
    | "trial.converted"
    | "trial.expired"
    | "trial.will_end"
    | "trial.checkout_ready"
    | "checkout.ready"
    | "payment.received"
    | "payment.failed"
    | "payment.recovered"
    | "payment.retry_failed"
    | "payment.refunded"
    | "payment.disputed"
    | "payment.dispute_resolved"
    | "payment_link.created"
    | "payment_link.completed"
    | "payment_link.failed"
    | "payment_link.canceled"
    | "invoice.created"
    | "invoice.voided"
    | "invoice.overdue"
    | "invoice.upcoming"
    | "payment_method.attached"
    | "payment_method.updated"
    | "customer.created"
    | "customer.updated"
    | "customer.state_changed"
    | "credits.granted"
    | "credits.purchased"
    | "credits.low"
    | "credits.depleted"
    | "credits.expired"
    | "balance.topped_up"
    | "balance.low"
    | "balance.depleted"
    | "quota.threshold_reached"
    | "quota.exceeded"
    | "seats.updated"
    | "seats.limit_reached"
    | "addon.activated"
    | "addon.deactivated"
    | "usage.recorded"
    | "payout.available"
    | "payout.created"
    | "payout.paid"
    | "payout.failed"
  >;
  description?: string | null;
  isActive?: boolean;
  apiVersion?: string;
}

export interface DeleteWebhookEndpointParams {
  id: string;
}

export interface TestWebhookEndpointParams {
  id: string;
}

export interface ListWebhookEndpointsParams {
  cursor?: string;
  limit?: number;
}

export interface CreateWebhookEndpointParams {
  url: string;
  events: Array<
    | "subscription.created"
    | "subscription.activated"
    | "subscription.reactivated"
    | "subscription.canceled"
    | "subscription.updated"
    | "subscription.plan_changed"
    | "subscription.cancellation_scheduled"
    | "subscription.cancellation_revoked"
    | "subscription.plan_change_scheduled"
    | "subscription.plan_change_revoked"
    | "subscription.past_due"
    | "trial.started"
    | "trial.converted"
    | "trial.expired"
    | "trial.will_end"
    | "trial.checkout_ready"
    | "checkout.ready"
    | "payment.received"
    | "payment.failed"
    | "payment.recovered"
    | "payment.retry_failed"
    | "payment.refunded"
    | "payment.disputed"
    | "payment.dispute_resolved"
    | "payment_link.created"
    | "payment_link.completed"
    | "payment_link.failed"
    | "payment_link.canceled"
    | "invoice.created"
    | "invoice.voided"
    | "invoice.overdue"
    | "invoice.upcoming"
    | "payment_method.attached"
    | "payment_method.updated"
    | "customer.created"
    | "customer.updated"
    | "customer.state_changed"
    | "credits.granted"
    | "credits.purchased"
    | "credits.low"
    | "credits.depleted"
    | "credits.expired"
    | "balance.topped_up"
    | "balance.low"
    | "balance.depleted"
    | "quota.threshold_reached"
    | "quota.exceeded"
    | "seats.updated"
    | "seats.limit_reached"
    | "addon.activated"
    | "addon.deactivated"
    | "usage.recorded"
    | "payout.available"
    | "payout.created"
    | "payout.paid"
    | "payout.failed"
  >;
  description?: string;
  apiVersion?: string;
}

export class GeneratedWebhooksResource extends Webhooks {
  constructor(private httpClient: CommetHTTPClient) {
    super();
  }

  /** Retrieve a webhook endpoint by its public ID. */
  async get(
    params: GetWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<Webhook> {
    const { id } = params;
    return this.httpClient.get(`/webhooks/${id}`, undefined, options);
  }

  /** Update a webhook endpoint. Only the provided fields change. */
  async update(
    params: UpdateWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<Webhook> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/webhooks/${id}`, rest, options);
  }

  /** Permanently delete a webhook endpoint. */
  async delete(
    params: DeleteWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/webhooks/${id}`, undefined, options);
  }

  /** Send a test event to a webhook endpoint to verify connectivity. */
  async test(
    params: TestWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<WebhookTest> {
    const { id } = params;
    return this.httpClient.post(`/webhooks/${id}/test`, {}, options);
  }

  /** List webhook endpoints with cursor-based pagination. */
  async list(
    params?: ListWebhookEndpointsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Webhook>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/webhooks", params, options);
  }

  /** Create a new webhook endpoint. The response includes the signing secret which is only returned once. */
  async create(
    params: CreateWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<CreatedWebhook> {
    return this.httpClient.post("/webhooks", params, options);
  }
}
