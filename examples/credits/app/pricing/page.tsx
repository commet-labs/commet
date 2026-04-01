import type { PlanFeature } from "@commet/node";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { getPlansAction } from "@/actions/plans";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";
import { checkoutAction } from "@/lib/payments/actions";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatBillingInterval(
  interval: "monthly" | "yearly" | "quarterly",
): string {
  if (interval === "monthly") return "mo";
  if (interval === "yearly") return "yr";
  return "qtr";
}

function formatFeature(feature: PlanFeature): string {
  if (feature.type === "boolean" && feature.enabled) {
    return feature.name;
  }
  if (feature.type === "metered" && feature.includedAmount !== undefined) {
    return `${feature.includedAmount.toLocaleString()} ${feature.name} included`;
  }
  if (feature.type === "seats" && feature.includedAmount !== undefined) {
    return `${feature.includedAmount} ${feature.name}`;
  }
  return feature.name;
}

export default async function PricingPage() {
  const user = await getUser();
  if (user) {
    const subscriptionResult = await commet.subscriptions.get(user.id);
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
  const plans = plansResult.data || [];

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="mb-12 flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Credit packs for every need. Buy once, use as you go. Top up anytime.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No plans available yet. Configure plans in your Commet dashboard.
        </p>
      ) : (
        <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const defaultPrice =
              plan.prices.find((p) => p.isDefault) || plan.prices[0];

            return (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.description && (
                    <CardDescription>{plan.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold">
                      {defaultPrice ? formatPrice(defaultPrice.price) : "Free"}
                    </span>
                    {defaultPrice && (
                      <span className="text-sm text-muted-foreground">
                        /
                        {formatBillingInterval(
                          defaultPrice.billingInterval || "monthly",
                        )}
                      </span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.code}
                        className="flex items-center gap-2"
                      >
                        <Check className="size-4 text-muted-foreground" />
                        <span>{formatFeature(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <form action={checkoutAction} className="w-full">
                    <input type="hidden" name="planCode" value={plan.code} />
                    <Button type="submit" className="w-full">
                      Get started
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
