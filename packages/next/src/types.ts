import type { WebhookData, WebhookEvent, WebhookPayload } from "@commet/node";

export type { WebhookData, WebhookEvent, WebhookPayload };

export interface WebhooksConfig {
  webhookSecret: string;
  onSubscriptionActivated?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionCanceled?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionCreated?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionUpdated?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionPlanChanged?: (payload: WebhookPayload) => Promise<void>;
  onCustomerStateChanged?: (payload: WebhookPayload) => Promise<void>;
  onPaymentReceived?: (payload: WebhookPayload) => Promise<void>;
  onPaymentFailed?: (payload: WebhookPayload) => Promise<void>;
  onPaymentRecovered?: (payload: WebhookPayload) => Promise<void>;
  onUsageRecorded?: (payload: WebhookPayload) => Promise<void>;
  onInvoiceCreated?: (payload: WebhookPayload) => Promise<void>;
  onPayload?: (payload: WebhookPayload) => Promise<void>;
  onError?: (error: Error, payload: unknown) => Promise<void>;
}
