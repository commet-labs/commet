"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { GeneratedPlanCode } from "@commet/node";
type BillingInterval = "monthly" | "quarterly" | "yearly";

interface CreateSubscriptionResult {
  success: boolean;
  error?: string;
  checkoutUrl?: string;
  subscriptionId?: string;
}

export async function createSubscriptionAction(
  planCode: GeneratedPlanCode,
  billingInterval?: BillingInterval,
): Promise<CreateSubscriptionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const user = session.user;

    // Customer is already created by the plugin on signup
    // Check if already has active subscription
    const existing = await commet.subscriptions.get(user.id);

    if (existing.data) {
      if (
        existing.data.status === "active" ||
        existing.data.status === "trialing"
      ) {
        redirect("/dashboard");
      }

      if (existing.data.status === "pending_payment") {
        return {
          success: true,
          subscriptionId: existing.data.id,
          checkoutUrl: existing.data.checkoutUrl || undefined,
        };
      }
    }

    // Create subscription
    const result = await commet.subscriptions.create({
      externalId: user.id,
      planCode,
      billingInterval,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.message || "Failed to create subscription",
      };
    }

    return {
      success: true,
      subscriptionId: result.data.id,
      checkoutUrl: result.data.checkoutUrl || undefined,
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
