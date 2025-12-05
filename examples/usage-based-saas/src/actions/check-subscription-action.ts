"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";

export interface SubscriptionStatus {
  isPaid: boolean;
  subscriptionId?: string;
  status?: string;
  planName?: string;
  daysRemaining?: number;
}

export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { isPaid: false };
    }

    const result = await commet.subscriptions.get({
      externalId: session.user.id,
    });

    if (!result.success || !result.data) {
      return { isPaid: false };
    }

    const subscription = result.data;
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    return {
      isPaid: isActive,
      subscriptionId: subscription.id,
      status: subscription.status,
      planName: subscription.plan.name,
      daysRemaining: subscription.currentPeriod.daysRemaining,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return { isPaid: false };
  }
}


