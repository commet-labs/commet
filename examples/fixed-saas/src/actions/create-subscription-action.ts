"use server";

import { auth } from "@/lib/auth";
import { COMMET_PRICE_ID, commet } from "@/lib/commet";
import { redirect } from "next/navigation";

interface CreateSubscriptionResult {
  success: boolean;
  error?: string;
  checkoutUrl?: string;
  subscriptionId?: string;
}

/**
 * Create a subscription for the current user
 * Ensures customer exists and creates subscription with checkout URL
 */
export async function createSubscriptionAction(): Promise<CreateSubscriptionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const user = session.user;

    // Ensure customer exists in Commet
    const customerCheck = await commet.customers.list({
      externalId: user.id,
    });

    // Create customer if doesn't exist
    if (
      !customerCheck.success ||
      !customerCheck.data ||
      customerCheck.data.length === 0
    ) {
      const createResult = await commet.customers.create({
        externalId: user.id,
        legalName: user.name || user.email,
        billingEmail: user.email,
        taxStatus: "NOT_APPLICABLE",
        currency: "USD",
      });

      if (!createResult.success) {
        return {
          success: false,
          error: "Failed to create customer in billing system",
        };
      }
    }

    // Check if user already has an active subscription
    const existingSubscriptions = await commet.subscriptions.list({
      externalId: user.id,
    });

    if (
      existingSubscriptions.success &&
      existingSubscriptions.data &&
      existingSubscriptions.data.length > 0
    ) {
      // Check for active subscription
      const activeSubscription = existingSubscriptions.data.find(
        (sub) => sub.status === "active",
      );
      if (activeSubscription) {
        redirect("/dashboard");
      }

      // Check for pending subscription (don't create duplicate)
      const pendingSubscription = existingSubscriptions.data.find(
        (sub) => sub.status === "pending_payment",
      );
      if (pendingSubscription) {
        const checkoutUrl = (pendingSubscription as { checkoutUrl?: string })
          .checkoutUrl;
        return {
          success: true,
          subscriptionId: pendingSubscription.id,
          checkoutUrl: checkoutUrl || undefined,
        };
      }
    }

    // Create new subscription
    const subscriptionResult = await commet.subscriptions.create({
      externalId: user.id,
      items: [
        {
          priceId: COMMET_PRICE_ID,
          quantity: 1,
        },
      ],
      status: "pending_payment",
    });

    if (!subscriptionResult.success || !subscriptionResult.data) {
      return {
        success: false,
        error: "Failed to create subscription",
      };
    }

    const subscription = subscriptionResult.data;
    const checkoutUrl = (subscription as { checkoutUrl?: string }).checkoutUrl;

    return {
      success: true,
      subscriptionId: subscription.id,
      checkoutUrl: checkoutUrl || undefined,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
