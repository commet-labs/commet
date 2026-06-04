import type { BillingInterval, Plan, PlanFeature } from "@commet/node";
import { redirect } from "next/navigation";
import { checkoutAction } from "@/actions/checkout";
import { getPlansAction } from "@/actions/plans";
import {
  PlanCard,
  PlanCardAction,
  PlanCardBadge,
  PlanCardFeature,
  PlanCardFeatures,
  PlanCardPrice,
  PlanCardTitle,
} from "@/components/ui/plan-card";
import { getUser } from "@/lib/auth/session";
import { RATE_SCALE } from "@/lib/billing";
import { commet } from "@/lib/commet";

function planPriceCents(plan: Plan): number {
  const price = plan.prices.find((p) => p.isDefault) || plan.prices[0];
  return price?.price ?? 0;
}

function mapPeriod(interval?: BillingInterval): "month" | "year" | "once" {
  return interval === "yearly" ? "year" : "month";
}

function formatIncluded(feature: PlanFeature): string | null {
  if (feature.type === "boolean") {
    return feature.enabled ? feature.name : null;
  }
  if (feature.includedAmount !== undefined) {
    return `${feature.includedAmount.toLocaleString()} ${feature.unitName ?? feature.name} included`;
  }
  return feature.name;
}

function formatOverage(feature: PlanFeature): string | null {
  if (!feature.overageEnabled || feature.overageUnitPrice === undefined) {
    return null;
  }
  const price = (feature.overageUnitPrice / RATE_SCALE).toFixed(2);
  const unit = feature.unitName ?? "unit";
  const singularUnit = unit.endsWith("s") ? unit.slice(0, -1) : unit;
  return `Then $${price} per additional ${singularUnit}`;
}

export default async function PricingPage() {
  const user = await getUser();
  if (user) {
    const subscriptionResult = await commet.subscriptions.getActive({
      customerId: user.id,
    });
    if (subscriptionResult.success && subscriptionResult.data) {
      const subscription = subscriptionResult.data;
      if (
        subscription.status === "pending_payment" &&
        subscription.checkoutUrl
      ) {
        redirect(subscription.checkoutUrl);
      }
      if (
        subscription.status === "active" ||
        subscription.status === "trialing"
      ) {
        redirect("/api/commet/portal");
      }
    }
  }

  const plansResult = await getPlansAction();
  const plans = [...(plansResult.data || [])].sort(
    (a, b) => planPriceCents(a) - planPriceCents(b),
  );
  const popularIndex = plans.length === 3 ? 1 : -1;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="mb-12 flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Simple, quota-based pricing. Choose the plan that fits your team. Pay
          for extra tasks only when you go over.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No plans available yet. Configure plans in your Commet dashboard.
        </p>
      ) : (
        <div className="grid w-full max-w-5xl items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const defaultPrice =
              plan.prices.find((p) => p.isDefault) || plan.prices[0];
            const highlighted = index === popularIndex;
            const visibleFeatures = plan.features.filter(
              (feature) => feature.enabled !== false,
            );
            const overage = visibleFeatures
              .map(formatOverage)
              .find((line): line is string => line !== null);

            return (
              <PlanCard
                key={plan.id}
                variant={highlighted ? "highlighted" : "default"}
                className="flex flex-col"
              >
                {highlighted && <PlanCardBadge>Most popular</PlanCardBadge>}
                <PlanCardTitle>{plan.name}</PlanCardTitle>
                <PlanCardPrice
                  amount={defaultPrice ? defaultPrice.price / 100 : 0}
                  period={mapPeriod(defaultPrice?.billingInterval)}
                />
                <PlanCardFeatures className="flex-1">
                  {visibleFeatures.map((feature) => {
                    const label = formatIncluded(feature);
                    return label ? (
                      <PlanCardFeature key={feature.code}>
                        {label}
                      </PlanCardFeature>
                    ) : null;
                  })}
                  {overage && <PlanCardFeature>{overage}</PlanCardFeature>}
                </PlanCardFeatures>
                <form action={checkoutAction}>
                  <input type="hidden" name="planCode" value={plan.code} />
                  <PlanCardAction
                    type="submit"
                    variant={highlighted ? undefined : "outline"}
                  >
                    Get started
                  </PlanCardAction>
                </form>
              </PlanCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
