import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { updateUserSubscription } from "@/lib/db/queries";
import { Webhooks } from "@commet/next";
import type { WebhookPayload } from "@commet/next";
import { eq } from "drizzle-orm";

/**
 * Get user ID from webhook payload using externalId
 * With Better Auth + Commet, the externalId is the user's ID
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

    // Update user subscription status
    await updateUserSubscription(userId, {
      subscriptionId: payload.data.subscriptionId as string,
      isPaid: true,
    });

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

    // Update user subscription status
    await updateUserSubscription(userId, {
      subscriptionId: null,
      isPaid: false,
    });

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
    const userId = getUserIdFromPayload(payload);

    if (userId) {
      const isPaid =
        payload.data.status === "active" || payload.data.status === "trialing";
      await updateUserSubscription(userId, {
        subscriptionId: payload.data.subscriptionId as string,
        isPaid,
      });
    }

    console.log(
      `[Webhook] Subscription updated: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
    );
  },

  onError: async (error, payload) => {
    console.error("[Webhook] Error processing webhook:", error);
    console.error("[Webhook] Payload:", payload);
  },
});
