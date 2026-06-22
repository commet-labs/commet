import type { BillingFeature } from "@/lib/db/schema";

export interface DerivedAccess {
  planLabel: string;
  status: string;
  features: BillingFeature[];
}

export function hasUsableSubscription(
  status: string | null | undefined,
): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function resolveAccessForBillingState(
  state: {
    planName: string | null;
    subscriptionStatus: string | null;
    features: BillingFeature[];
  } | null,
): DerivedAccess {
  if (!state?.subscriptionStatus) {
    return { planLabel: "Free", status: "none", features: [] };
  }

  return {
    planLabel: state.planName ?? "Free",
    status: state.subscriptionStatus,
    features: state.features,
  };
}
