import type { PlanFeature } from "@commet/node";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { getPlansAction } from "@/actions/plans";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";
import { checkoutAction } from "@/lib/payments/actions";

function formatBillingInterval(
  interval: "monthly" | "yearly" | "quarterly",
): string {
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
        const portalResult = await commet.portal.getUrl({
          externalId: user.id,
        });
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
    <main className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-20 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a plan that fits your team.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="w-full max-w-md p-8 border border-border">
            <h2 className="text-lg font-medium text-muted-foreground mb-2">
              No plans available
            </h2>
            <p className="text-muted-foreground text-sm">
              Plans will appear here once configured.
            </p>
          </div>
        </div>
      ) : plans.length === 1 ? (
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="w-full max-w-md">
            <PricingCard
              key={plans[0].id}
              name={plans[0].name}
              price={
                plans[0].prices.find((p) => p.isDefault)?.price ||
                plans[0].prices[0]?.price ||
                0
              }
              interval={formatBillingInterval(
                plans[0].prices.find((p) => p.isDefault)?.billingInterval ||
                  plans[0].prices[0]?.billingInterval ||
                  "monthly",
              )}
              description={
                plans[0].description ||
                `For ${plans[0].name.toLowerCase()} teams.`
              }
              features={plans[0].features.map(formatFeature)}
              planCode={plans[0].code}
              highlight={plans[0].isDefault}
            />
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {plans.map((plan, index) => {
            const defaultPrice =
              plan.prices.find((p) => p.isDefault) || plan.prices[0];
            return (
              <PricingCard
                key={plan.id}
                name={plan.name}
                price={defaultPrice?.price || 0}
                interval={formatBillingInterval(
                  defaultPrice?.billingInterval || "monthly",
                )}
                description={
                  plan.description || `For ${plan.name.toLowerCase()} teams.`
                }
                features={plan.features.map(formatFeature)}
                planCode={plan.code}
                highlight={
                  plan.isDefault || index === Math.floor(plans.length / 2)
                }
              />
            );
          })}
        </div>
      )}
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
      className={`relative p-8 flex flex-col h-full border ${
        highlight ? "border-primary shadow-sm" : "border-border"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wider py-0.5 px-3">
          Popular
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-1">{name}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="flex items-baseline mb-8">
        <span className="text-4xl font-light tabular-nums">${price / 100}</span>
        <span className="text-muted-foreground ml-2 text-sm">/{interval}</span>
      </div>

      <ul className="space-y-3 mb-10 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Check className="h-4 w-4 mt-0.5 mr-3 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <form action={checkoutAction}>
        <input type="hidden" name="planCode" value={planCode} />
        <Button type="submit" className="w-full h-10">
          Get Started
        </Button>
      </form>
    </div>
  );
}
