"use server";

import { commet } from "@/lib/commet";

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number; // in cents
  billingInterval: "monthly" | "yearly";
  features: string[];
  planCode: string;
  isDefault?: boolean;
}

/**
 * Get all public plans from Commet
 */
export async function getPlansAction(): Promise<{
  success: boolean;
  data?: PricingPlan[];
  error?: string;
}> {
  try {
    // Get public plans from Commet
    const result = await commet.plans.list({ includePrivate: false });

    if (!result.success || !result.data) {
      return { success: false, error: "Unable to load plans. Please try again." };
    }

    // Transform Commet plans to our format
    const plans: PricingPlan[] = result.data
      .filter((plan) => plan.isPublic) // Only public plans
      .map((plan) => {
        // Get the default price or first monthly price
        const defaultPrice =
          plan.prices.find((p) => p.isDefault) ||
          plan.prices.find((p) => p.billingInterval === "monthly") ||
          plan.prices[0];

        // Generate features list from plan features
        const features: string[] = plan.features.map((feature) => {
          if (feature.type === "metered" && feature.includedAmount !== undefined) {
            return `${feature.includedAmount.toLocaleString()} ${feature.name} included`;
          }
          if (feature.type === "boolean" && feature.enabled) {
            return feature.name;
          }
          return feature.name;
        });

        // Use plan ID as planCode for checkout (the SDK accepts planId)
        // The planCode will be used as planId in the checkout session
        const planCode = plan.id;

        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: defaultPrice?.price || 0,
          billingInterval: (defaultPrice?.billingInterval || "monthly") as "monthly" | "yearly",
          features,
          planCode,
          isDefault: plan.isDefault,
        };
      })
      .sort((a, b) => {
        // Sort by price ascending, but put default plan first
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return a.price - b.price;
      });

    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "Unable to load plans. Please try again." };
  }
}
