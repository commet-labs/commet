import type {
  WebhookData,
  WebhookEvent,
  WebhookEventPayload,
  WebhookPayload,
} from "@commet/node";

// Re-export types from @commet/node for convenience
export type { WebhookData, WebhookEvent, WebhookEventPayload, WebhookPayload };

type PascalCaseEventSegment<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Capitalize<Head>}${PascalCaseEventSegment<Tail>}`
    : Capitalize<S>;

type PascalCaseEventName<S extends string> =
  S extends `${infer Head}.${infer Tail}`
    ? `${PascalCaseEventSegment<Head>}${PascalCaseEventName<Tail>}`
    : PascalCaseEventSegment<S>;

export type WebhookPayloadFor<E extends WebhookEvent> = Extract<
  WebhookEventPayload,
  { event: E }
>;

export type WebhookHandler<E extends WebhookEvent> = (
  payload: WebhookPayloadFor<E>,
) => Promise<void>;

export type WebhookHandlerName<E extends WebhookEvent = WebhookEvent> =
  `on${PascalCaseEventName<E>}`;

/**
 * Named callbacks for every Commet webhook event.
 *
 * Event names become callback names by removing dots/underscores and applying PascalCase:
 * `payment_link.completed` -> `onPaymentLinkCompleted`.
 */
export type WebhookNamedHandlers = {
  [E in WebhookEvent as WebhookHandlerName<E>]?: WebhookHandler<E>;
};

/**
 * Configuration for the Commet webhook handler
 */
export interface WebhooksConfig extends WebhookNamedHandlers {
  /**
   * Webhook secret from your Commet dashboard
   * Used to verify webhook signatures
   */
  webhookSecret: string;

  /**
   * Handles the `subscription.activated` webhook event
   *
   * Fired when a subscription payment is successful and the subscription becomes active.
   * This is when you should grant access to your product.
   *
   * @param payload - The webhook payload containing subscription data
   *
   * @example
   * ```typescript
   * onSubscriptionActivated: async (payload) => {
   *   await db.update(users)
   *     .set({ isPaid: true })
   *     .where(eq(users.id, payload.data.customerId));
   * }
   * ```
   */
  onSubscriptionActivated?: WebhookHandler<"subscription.activated">;

  /**
   * Handles the `subscription.canceled` webhook event
   *
   * Fired when a subscription is canceled (either by the customer or administratively).
   * This is when you should revoke access to your product.
   *
   * @param payload - The webhook payload containing subscription data
   *
   * @example
   * ```typescript
   * onSubscriptionCanceled: async (payload) => {
   *   await db.update(users)
   *     .set({ isPaid: false })
   *     .where(eq(users.id, payload.data.customerId));
   * }
   * ```
   */
  onSubscriptionCanceled?: WebhookHandler<"subscription.canceled">;

  /**
   * Handles the `subscription.created` webhook event
   *
   * Fired when a new subscription is created, but before payment is processed.
   * Typically used for logging or analytics, not for granting access.
   *
   * @param payload - The webhook payload containing subscription data
   *
   * @example
   * ```typescript
   * onSubscriptionCreated: async (payload) => {
   *   console.log(`New subscription: ${payload.data.subscriptionId}`);
   * }
   * ```
   */
  onSubscriptionCreated?: WebhookHandler<"subscription.created">;

  /**
   * Handles the `subscription.updated` webhook event
   *
   * Fired when subscription details change (plan, quantity, status, etc.).
   * Use this to handle upgrades, downgrades, or status transitions.
   *
   * @param payload - The webhook payload containing subscription data
   *
   * @example
   * ```typescript
   * onSubscriptionUpdated: async (payload) => {
   *   if (payload.data.status === 'active') {
   *     await handleActivation(payload);
   *   }
   * }
   * ```
   */
  onSubscriptionUpdated?: WebhookHandler<"subscription.updated">;

  /**
   * Handles the `subscription.plan_changed` webhook event
   *
   * Fired when a subscription changes from one plan to another (upgrade, downgrade,
   * or billing interval change). The subscription stays active — access does not change.
   *
   * @param payload - The webhook payload containing plan change data
   *
   * @example
   * ```typescript
   * onSubscriptionPlanChanged: async (payload) => {
   *   await db.update(users)
   *     .set({ planId: payload.data.currentPlan.id })
   *     .where(eq(users.id, payload.data.customerId));
   * }
   * ```
   */
  onSubscriptionPlanChanged?: WebhookHandler<"subscription.plan_changed">;

  /**
   * Handles the `customer.state_changed` webhook event
   *
   * Fired whenever a customer's billing state snapshot changes.
   */
  onCustomerStateChanged?: WebhookHandler<"customer.state_changed">;

  /**
   * Handles the `payment.received` webhook event
   *
   * Fired when a payment is successfully processed for a subscription.
   *
   * @param payload - The webhook payload containing payment data
   */
  onPaymentReceived?: WebhookHandler<"payment.received">;

  /**
   * Handles the `payment.recovered` webhook event
   *
   * Fired when a previously failed payment succeeds.
   */
  onPaymentRecovered?: WebhookHandler<"payment.recovered">;

  /**
   * Handles the `payment.failed` webhook event
   *
   * Fired when a payment attempt fails. Use this to notify users
   * or trigger dunning flows.
   *
   * @param payload - The webhook payload containing payment data
   */
  onPaymentFailed?: WebhookHandler<"payment.failed">;

  /**
   * Handles the `usage.recorded` webhook event
   *
   * Fired after usage is recorded for a customer feature.
   */
  onUsageRecorded?: WebhookHandler<"usage.recorded">;

  /**
   * Handles the `invoice.created` webhook event
   *
   * Fired when a new invoice is generated for a subscription billing cycle.
   *
   * @param payload - The webhook payload containing invoice data
   */
  onInvoiceCreated?: WebhookHandler<"invoice.created">;

  /**
   * Catch-all handler that receives all webhook events
   *
   * Useful for logging, analytics, or handling events without specific handlers.
   * Called in addition to specific event handlers.
   *
   * @param payload - The webhook payload
   *
   * @example
   * ```typescript
   * onPayload: async (payload) => {
   *   console.log(`Webhook received: ${payload.event}`);
   *   await analytics.track('webhook_received', { event: payload.event });
   * }
   * ```
   */
  onPayload?: (payload: WebhookEventPayload) => Promise<void>;

  /**
   * Error handler for webhook processing failures
   *
   * Called when signature verification fails or handlers throw errors.
   * Use this for custom error logging or alerting.
   *
   * @param error - The error that occurred
   * @param payload - The raw payload (may be undefined if parsing failed)
   *
   * @example
   * ```typescript
   * onError: async (error, payload) => {
   *   console.error('Webhook error:', error);
   *   await logger.error('webhook_failed', { error, payload });
   * }
   * ```
   */
  onError?: (error: Error, payload: unknown) => Promise<void>;
}
