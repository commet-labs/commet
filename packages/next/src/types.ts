import type { WebhookData, WebhookEvent, WebhookPayload } from "@commet/node";

// Re-export types from @commet/node for convenience
export type { WebhookData, WebhookEvent, WebhookPayload };

/**
 * Configuration for the Commet webhook handler
 */
export interface WebhooksConfig {
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
  onSubscriptionActivated?: (payload: WebhookPayload) => Promise<void>;

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
  onSubscriptionCanceled?: (payload: WebhookPayload) => Promise<void>;

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
  onSubscriptionCreated?: (payload: WebhookPayload) => Promise<void>;

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
  onSubscriptionUpdated?: (payload: WebhookPayload) => Promise<void>;

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
  onSubscriptionPlanChanged?: (payload: WebhookPayload) => Promise<void>;

  /**
   * Handles the `payment.received` webhook event
   *
   * Fired when a payment is successfully processed for a subscription.
   *
   * @param payload - The webhook payload containing payment data
   */
  onPaymentReceived?: (payload: WebhookPayload) => Promise<void>;

  /**
   * Handles the `payment.failed` webhook event
   *
   * Fired when a payment attempt fails. Use this to notify users
   * or trigger dunning flows.
   *
   * @param payload - The webhook payload containing payment data
   */
  onPaymentFailed?: (payload: WebhookPayload) => Promise<void>;

  /**
   * Handles the `invoice.created` webhook event
   *
   * Fired when a new invoice is generated for a subscription billing cycle.
   *
   * @param payload - The webhook payload containing invoice data
   */
  onInvoiceCreated?: (payload: WebhookPayload) => Promise<void>;

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
  onPayload?: (payload: WebhookPayload) => Promise<void>;

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
