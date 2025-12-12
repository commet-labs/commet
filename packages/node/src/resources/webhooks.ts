import crypto from "node:crypto";

/**
 * Webhook payload structure from Commet
 */
export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  organizationId: string;
  data: WebhookData;
}

/**
 * Webhook data structure (subscription-related fields)
 */
export interface WebhookData {
  id?: string;
  publicId?: string;
  subscriptionId?: string;
  customerId?: string;
  externalId?: string;
  status?: string;
  name?: string;
  canceledAt?: string;
  [key: string]: unknown;
}

/**
 * Supported webhook events
 */
export type WebhookEvent =
  | "subscription.created"
  | "subscription.activated"
  | "subscription.canceled"
  | "subscription.updated";

export interface VerifyAndParseParams {
  rawBody: string;
  signature: string | null;
  secret: string;
}

/**
 * Webhooks resource for signature verification
 */
export class Webhooks {
  /**
   * Verify HMAC-SHA256 webhook signature
   *
   * Use this method to verify that webhooks are authentically from Commet.
   * The signature is included in the `X-Commet-Signature` header.
   *
   * @param payload - Raw request body as string (IMPORTANT: Do not parse JSON first)
   * @param signature - Value from X-Commet-Signature header
   * @param secret - Your webhook secret from Commet dashboard
   * @returns true if signature is valid, false otherwise
   *
   * @example
   * ```typescript
   * // Next.js API route example
   * export async function POST(request: Request) {
   *   const rawBody = await request.text();
   *   const signature = request.headers.get('x-commet-signature');
   *
   *   const isValid = commet.webhooks.verify(
   *     rawBody,
   *     signature,
   *     process.env.COMMET_WEBHOOK_SECRET
   *   );
   *
   *   if (!isValid) {
   *     return new Response('Invalid signature', { status: 401 });
   *   }
   *
   *   const payload = JSON.parse(rawBody);
   *   // Handle webhook event...
   * }
   * ```
   */
  verify(payload: string, signature: string | null, secret: string): boolean {
    if (!signature || !secret || !payload) {
      return false;
    }

    try {
      const expectedSignature = this.generateSignature({ payload, secret });

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex"),
      );
    } catch (error) {
      // timingSafeEqual throws if lengths don't match
      return false;
    }
  }

  /**
   * Generate HMAC-SHA256 signature (internal use)
   * @internal
   */
  private generateSignature(params: { payload: string; secret: string }): string {
    return crypto.createHmac("sha256", params.secret).update(params.payload).digest("hex");
  }

  /**
   * Parse and verify webhook payload in one step
   *
   * @example
   * ```typescript
   * const payload = commet.webhooks.verifyAndParse({
   *   rawBody,
   *   signature,
   *   secret: process.env.COMMET_WEBHOOK_SECRET
   * });
   *
   * if (!payload) {
   *   return new Response('Invalid signature', { status: 401 });
   * }
   *
   * // payload is typed and validated
   * if (payload.event === 'subscription.activated') {
   *   // Handle activation...
   * }
   * ```
   */
  verifyAndParse(params: VerifyAndParseParams): WebhookPayload | null {
    const { rawBody, signature, secret } = params;

    if (!this.verify(rawBody, signature, secret)) {
      return null;
    }

    try {
      return JSON.parse(params.rawBody) as WebhookPayload;
    } catch {
      return null;
    }
  }
}
