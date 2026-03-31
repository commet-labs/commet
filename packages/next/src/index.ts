/**
 * @commet/next - Next.js integration for Commet
 *
 * @example
 * Webhooks
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
 * @example
 * Customer Portal
 * ```typescript
 * import { CustomerPortal } from "@commet/next";
 *
 * export const GET = CustomerPortal({
 *   apiKey: process.env.COMMET_API_KEY!,
 *   getCustomerId: async (req) => {
 *     const session = await auth.api.getSession({ headers: req.headers });
 *     return session?.user.id;
 *   },
 * });
 * ```
 *
 * @packageDocumentation
 */

export type { CustomerPortalConfig } from "./portal";
export { CustomerPortal } from "./portal";
export type { PricingMarkdownConfig } from "./pricing-markdown";
export { PricingMarkdown } from "./pricing-markdown";
export type {
  WebhookData,
  WebhookEvent,
  WebhookPayload,
  WebhooksConfig,
} from "./types";
export { Webhooks } from "./webhooks";
