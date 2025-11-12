import { db } from "@/lib/db/connection";
import { user } from "@/lib/db/schema";
import { Webhooks } from "@commet/next";
import type { WebhookPayload } from "@commet/next";
import { eq } from "drizzle-orm";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,

  // Log all webhook events
  onPayload: async (payload) => {
    console.log(`[Webhook] Received ${payload.event}:`, {
      subscriptionId: payload.data.subscriptionId,
      customerId: payload.data.customerId,
      externalId: payload.data.externalId,
    });
  },

  // Handle subscription activation (payment successful)
  onSubscriptionActivated: async (payload) => {
    const userId = await getUserIdFromPayload(payload);

    if (!userId) {
      console.error(
        "[Webhook] Cannot find user for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Grant access to user
    await db
      .update(user)
      .set({
        isPaid: true,
        subscriptionId: payload.data.subscriptionId || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(
      `[Webhook] ✅ User ${userId} subscription activated: ${payload.data.subscriptionId}`,
    );
  },

  // Handle subscription cancellation
  onSubscriptionCanceled: async (payload) => {
    const userId = await getUserIdFromPayload(payload);

    if (!userId) {
      console.error(
        "[Webhook] Cannot find user for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Revoke access from user
    await db
      .update(user)
      .set({
        isPaid: false,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(
      `[Webhook] ❌ User ${userId} subscription canceled: ${payload.data.subscriptionId}`,
    );
  },
  onSubscriptionCreated: async (payload) => {
    console.log(
      `[Webhook] Subscription created: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
    );
  },
  onSubscriptionUpdated: async (payload) => {
    console.log(
      `[Webhook] Subscription updated: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
    );
  },
  onError: async (error, payload) => {
    console.error("[Webhook] Error processing webhook:", error);
    console.error("[Webhook] Payload:", payload);
  },
});

/**
 * Get user ID from webhook payload
 * Tries externalId first, falls back to customerId lookup
 */
async function getUserIdFromPayload(
  payload: WebhookPayload,
): Promise<string | null> {
  // Try externalId first (most efficient)
  if (payload.data.externalId) {
    return payload.data.externalId;
  }

  // Fallback: look up by Commet customer ID
  if (payload.data.customerId) {
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.commetCustomerId, payload.data.customerId))
      .limit(1);

    return existingUser?.id || null;
  }

  return null;
}
