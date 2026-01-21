import { db } from "@/lib/db/drizzle";
import { teams } from "@/lib/db/schema";
import { updateTeamSubscription } from "@/lib/db/queries";
import { Webhooks } from "@commet/next";
import type { WebhookPayload } from "@commet/next";
import { eq } from "drizzle-orm";

/**
 * Get team ID from webhook payload using externalId
 */
function getTeamIdFromPayload(payload: WebhookPayload): string | null {
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
    const teamId = getTeamIdFromPayload(payload);

    if (!teamId) {
      console.error(
        "[Webhook] Cannot find team for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Update team subscription status
    await updateTeamSubscription(Number.parseInt(teamId), {
      subscriptionStatus: "active",
      planName: (payload.data.planName as string) || null,
    });

    console.log(
      `[Webhook] ✅ Team ${teamId} subscription activated: ${payload.data.subscriptionId}`,
    );
  },

  // Handle subscription cancellation
  onSubscriptionCanceled: async (payload) => {
    const teamId = getTeamIdFromPayload(payload);

    if (!teamId) {
      console.error(
        "[Webhook] Cannot find team for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Update team subscription status
    await updateTeamSubscription(Number.parseInt(teamId), {
      subscriptionStatus: "canceled",
      planName: null,
    });

    console.log(
      `[Webhook] ❌ Team ${teamId} subscription canceled: ${payload.data.subscriptionId}`,
    );
  },

  onSubscriptionCreated: async (payload) => {
    console.log(
      `[Webhook] Subscription created: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
    );
  },

  onSubscriptionUpdated: async (payload) => {
    const teamId = getTeamIdFromPayload(payload);

    if (teamId) {
      await updateTeamSubscription(Number.parseInt(teamId), {
        subscriptionStatus: (payload.data.status as string) || "unknown",
        planName: (payload.data.planName as string) || null,
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
