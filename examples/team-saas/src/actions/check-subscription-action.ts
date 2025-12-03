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
  // Seat information
  seatsUsed: number;
  seatsIncluded: number;
  seatOveragePrice?: number;
}

export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  const defaultStatus: SubscriptionStatus = {
    isPaid: false,
    seatsUsed: 0,
    seatsIncluded: 0,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return defaultStatus;
    }

    const customer = commet.customer(session.user.id);

    // Get subscription status
    const result = await customer.subscription.get();
    if (!result.success || !result.data) {
      return defaultStatus;
    }

    const subscription = result.data;
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    // Get seat feature - all data comes from the API
    const seatResult = await customer.features.get("team_members");

    return {
      isPaid: isActive,
      subscriptionId: subscription.id,
      status: subscription.status,
      planName: subscription.plan.name,
      daysRemaining: subscription.currentPeriod.daysRemaining,
      seatsUsed: seatResult.data?.current ?? 0,
      seatsIncluded: seatResult.data?.included ?? 0,
      seatOveragePrice: seatResult.data?.overageUnitPrice,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return defaultStatus;
  }
}
