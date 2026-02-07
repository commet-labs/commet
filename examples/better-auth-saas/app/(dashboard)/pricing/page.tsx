import { getPlansAction } from "@/actions/plans";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { checkoutAction } from "@/lib/payments/actions";
import { Check, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import type { PlanFeature } from "@commet/node";

function formatBillingInterval(interval: "monthly" | "yearly" | "quarterly"): string {
  if (interval === "monthly") return "month";
  if (interval === "yearly") return "year";
  return "quarter";
}

function formatFeature(feature: PlanFeature): string {
  if (feature.type === "metered" && feature.includedAmount !== undefined) {
    return `${feature.includedAmount.toLocaleString()} ${feature.name} included`;
  }
  if (feature.type === "boolean" && feature.enabled) {
    return feature.name;
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
      if (subscription.status === "pending_payment" && subscription.checkoutUrl) {
        redirect(subscription.checkoutUrl);
      }

      if (subscription.status === "active" || subscription.status === "trialing") {
        const portalResult = await commet.portal.getUrl({ externalId: user.id });
        if (portalResult.success && portalResult.data?.portalUrl) {
          redirect(portalResult.data.portalUrl);
        }

        redirect("/dashboard");
      }
    }
  }

  const plansResult = await getPlansAction();
  const plans = plansResult.data || [];
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose a plan that fits your team. Includes seats, usage tracking,
          and feature flags out of the box.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="w-full max-w-md p-8 bg-card border border-border shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">No plans available</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Plans will appear here once available.
              </p>
            </div>
          </div>
        </div>
      ) : plans.length === 1 ? (
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="w-full max-w-md">
            <PricingCard
              key={plans[0].id}
              name={plans[0].name}
              price={plans[0].prices.find((p) => p.isDefault)?.price || plans[0].prices[0]?.price || 0}
              interval={formatBillingInterval(
                plans[0].prices.find((p) => p.isDefault)?.billingInterval ||
                plans[0].prices[0]?.billingInterval ||
                "monthly"
              )}
              description={plans[0].description || `Perfect for ${plans[0].name.toLowerCase()} teams.`}
              features={plans[0].features.map(formatFeature)}
              planCode={plans[0].code}
              highlight={plans[0].isDefault}
            />
          </div>
        </div>
      ) : (
        <div className={`grid gap-8 mx-auto ${
          plans.length === 2 ? "md:grid-cols-2 max-w-4xl" :
          plans.length === 3 ? "md:grid-cols-3 max-w-4xl" :
          "md:grid-cols-3 max-w-6xl"
        }`}>
          {plans.map((plan, index) => {
            const defaultPrice = plan.prices.find((p) => p.isDefault) || plan.prices[0];
            return (
              <PricingCard
                key={plan.id}
                name={plan.name}
                price={defaultPrice?.price || 0}
                interval={formatBillingInterval(defaultPrice?.billingInterval || "monthly")}
                description={plan.description || `Perfect for ${plan.name.toLowerCase()} teams.`}
                features={plan.features.map(formatFeature)}
                planCode={plan.code}
                highlight={plan.isDefault || index === Math.floor(plans.length / 2)}
              />
            );
          })}
        </div>
      )}

      <div className="mt-20 max-w-2xl mx-auto bg-muted p-8 border border-border flex items-start gap-6">
        <div className="bg-card p-3 shadow-sm border border-border shrink-0">
          <Zap className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Better Auth Plugin
          </h3>
          <p className="text-foreground leading-relaxed">
            This example uses the <strong>@commet/better-auth</strong> plugin.
            Subscriptions, seats, usage tracking, feature flags, and billing
            portal are all available through <code>authClient</code> — no
            separate SDK calls needed.
          </p>
        </div>
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  description,
  features,
  planCode,
  highlight = false,
}: {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  planCode: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative p-8 flex flex-col h-full transition-all duration-300 ${
        highlight
          ? "bg-card border-2 border-primary shadow-xl shadow-primary/20 scale-105 z-10"
          : "bg-card border border-border shadow-sm hover:shadow-md"
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{name}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex items-baseline mb-8">
        <span className="text-5xl font-extrabold text-foreground">
          ${price / 100}
        </span>
        <span className="text-muted-foreground ml-2 font-medium">/{interval}</span>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <div
              className={`mt-1 mr-3 rounded-full p-0.5 ${highlight ? "bg-primary/20 text-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <form action={checkoutAction}>
        <input type="hidden" name="planCode" value={planCode} />
        <Button
          type="submit"
          className={`w-full h-14 rounded-xl text-lg font-bold transition-all duration-300 ${
            highlight
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          Get Started
        </Button>
      </form>
    </div>
  );
}
