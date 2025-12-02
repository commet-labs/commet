import { db } from "@/lib/db/connection";
import { user } from "@/lib/db/schema";
import { Webhooks } from "@commet/next";
import type { WebhookPayload } from "@commet/next";
import { eq } from "drizzle-orm";

/**
 * Get user ID from webhook payload using externalId
 */
function getUserIdFromPayload(payload: WebhookPayload): string | null {
  return payload.data.externalId || null;
}

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
    const userId = getUserIdFromPayload(payload);

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
    const userId = getUserIdFromPayload(payload);

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

