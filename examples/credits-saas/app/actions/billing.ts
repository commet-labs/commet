"use server";

import { commet } from "@/lib/commet";
import { getTeamForUser } from "@/lib/db/queries";

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
 * Note: Invoices are not available via the Commet SDK yet
 */
export async function getBillingDataAction(): Promise<{
  success: boolean;
  data?: BillingData;
  error?: string;
}> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { success: false, error: "We couldn't find your workspace." };
    }

    // Get subscription from Commet
    const subscriptionResult = await commet.subscriptions.get(
      team.id.toString(),
    );

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
