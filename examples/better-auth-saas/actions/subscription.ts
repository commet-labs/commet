"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";

export async function hasActiveSubscriptionAction(): Promise<{
  success: boolean;
  hasActiveSubscription: boolean;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: true, hasActiveSubscription: false };
    }

    const subscriptionResult = await commet.subscriptions.get(user.id);

    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: true, hasActiveSubscription: false };
    }

    const subscription = subscriptionResult.data;
    const hasActive =
      subscription.status === "active" || subscription.status === "trialing";

    return {
      success: true,
      hasActiveSubscription: hasActive,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { success: true, hasActiveSubscription: false };
  }
}
