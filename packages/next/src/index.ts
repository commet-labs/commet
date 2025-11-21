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

export { Webhooks } from "./webhooks";
export type {
  WebhooksConfig,
  WebhookPayload,
  WebhookData,
  WebhookEvent,
} from "./types";

export { CustomerPortal } from "./portal";
export type { CustomerPortalConfig } from "./portal";
