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
   *     .where(eq(users.id, payload.data.externalId));
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
   *     .where(eq(users.id, payload.data.externalId));
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
