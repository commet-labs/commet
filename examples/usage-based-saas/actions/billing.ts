"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";

export interface BillingSubscription {
  id: string;
  planName: string;
  planPrice: number;
  billingInterval: "monthly" | "quarterly" | "yearly";
  status: string;
}

export interface BillingData {
  subscription: BillingSubscription | null;
}

/**
 * Get billing data from Commet (subscription only)
 */
export async function getBillingDataAction(): Promise<{
  success: boolean;
  data?: BillingData;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Please sign in to view billing." };
    }

    // Get subscription from Commet
    const subscriptionResult = await commet.subscriptions.get(user.id);

    let subscription: BillingSubscription | null = null;

    if (subscriptionResult.success && subscriptionResult.data) {
      const sub = subscriptionResult.data;
      subscription = {
        id: sub.id,
        planName: sub.plan.name,
        planPrice: sub.plan.basePrice,
        billingInterval: sub.plan.billingInterval,
        status: sub.status,
      };
    }

    return {
      success: true,
      data: {
        subscription,
      },
    };
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return { success: false, error: "Unable to load billing information. Please try again." };
  }
}
