"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";

export interface SubscriptionStatus {
  isPaid: boolean;
  subscriptionId?: string;
  status?: string;
}

/**
 * Check if user has an active subscription with Commet
 * This is a workaround until webhooks are implemented
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { isPaid: false };
    }

    const userId = session.user.id;

    // Query Commet for subscriptions by externalId
    const subscriptionsResult = await commet.subscriptions.list({
      externalId: userId,
      status: "active",
    });

    if (
      !subscriptionsResult.success ||
      !subscriptionsResult.data ||
      subscriptionsResult.data.length === 0
    ) {
      return { isPaid: false };
    }

    // User has at least one active subscription
    const subscription = subscriptionsResult.data[0];

    return {
      isPaid: true,
      subscriptionId: subscription.id,
      status: subscription.status,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return { isPaid: false };
  }
}
