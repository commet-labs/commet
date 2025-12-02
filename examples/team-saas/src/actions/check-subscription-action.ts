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
  seatOveragePrice: number;
}

export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  const defaultStatus: SubscriptionStatus = {
    isPaid: false,
    seatsUsed: 0,
    seatsIncluded: 3,
    seatOveragePrice: 1000,
  };

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return defaultStatus;
    }

    const result = await commet.subscriptions.get({
      externalId: session.user.id,
    });

    if (!result.success || !result.data) {
      return defaultStatus;
    }

    const subscription = result.data;
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    // Get seat balance from Commet
    let seatsUsed = 0;
    let seatsIncluded = 3;
    const seatOveragePrice = 1000;

    try {
      const seatBalance = await commet.seats.getBalance({
        externalId: session.user.id,
        seatType: "member",
      });

      if (seatBalance.success && seatBalance.data) {
        seatsUsed = seatBalance.data.current;
      }
    } catch (error) {
      console.error("Error fetching seat balance:", error);
    }

    // Get seat configuration from subscription features
    const seatFeature = subscription.features.find((f) => f.type === "seats");
    if (seatFeature?.usage?.included) {
      seatsIncluded = seatFeature.usage.included;
    }

    // Note: overageUnitPrice is not available in FeatureSummary,
    // using default value. For accurate pricing, fetch from plan.

    return {
      isPaid: isActive,
      subscriptionId: subscription.id,
      status: subscription.status,
      planName: subscription.plan.name,
      daysRemaining: subscription.currentPeriod.daysRemaining,
      seatsUsed,
      seatsIncluded,
      seatOveragePrice,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return defaultStatus;
  }
}
