/**
 * @commet/next - Next.js integration for Commet webhooks
 *
 * @example
 * ```typescript
 * import { Webhooks } from "@commet/next";
 *
 * export const POST = Webhooks({
 *   webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
 *   onSubscriptionActivated: async (payload) => {
 *     // Handle activation
 *   },
 * });
 * ```
 *
 * @packageDocumentation
 */

export { Webhooks } from "./webhooks";
export type {
  WebhooksConfig,
  WebhookPayload,
  WebhookData,
  WebhookEvent,
} from "./types";
