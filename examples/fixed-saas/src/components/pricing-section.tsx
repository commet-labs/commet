import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { commet } from "@/lib/commet";
import Link from "next/link";
import type { Plan, PlanPrice } from "@commet/node";

function formatPrice(price: PlanPrice) {
  const amount = (price.price / 100).toFixed(0);
  const interval =
    price.billingInterval === "yearly"
      ? "year"
      : price.billingInterval === "quarterly"
        ? "quarter"
        : "month";
  return { amount, interval };
}

function PlanCard({ plan, featured }: { plan: Plan; featured?: boolean }) {
  const defaultPrice = plan.prices.find((p) => p.isDefault) ?? plan.prices[0];

  return (
    <Card
      className={`relative flex flex-col ${featured ? "border-primary shadow-lg scale-105" : ""}`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        {plan.description && (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Price */}
        {defaultPrice && (
          <div className="text-center mb-6">
            <span className="text-4xl font-bold">
              ${formatPrice(defaultPrice).amount}
            </span>
            <span className="text-muted-foreground">
              /{formatPrice(defaultPrice).interval}
            </span>
          </div>
        )}

        {/* Trial */}
        {plan.trialDays > 0 && (
          <p className="text-sm text-primary text-center mb-4">
            {plan.trialDays}-day free trial
          </p>
        )}

        {/* Features */}
        {plan.features.length > 0 && (
          <ul className="space-y-3 mb-6 flex-1">
            {plan.features.map((feature) => (
              <li key={feature.code} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  {feature.name}
                  {feature.type !== "boolean" && (
                    <span className="text-muted-foreground ml-1">
                      {feature.unlimited
                        ? "(unlimited)"
                        : feature.includedAmount != null
                          ? `(${feature.includedAmount} included)`
                          : null}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Button
          asChild
          className="w-full mt-auto"
          variant={featured ? "default" : "outline"}
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export async function PricingSection() {
  const result = await commet.plans.list();

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Configure your plans in the Commet dashboard to display them here.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const plans = result.data.sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredIndex = Math.floor(plans.length / 2);

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Pricing
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include a free trial.
        </p>
      </div>

      <div
        className={`grid gap-8 items-start ${
          plans.length === 1
            ? "max-w-md mx-auto"
            : plans.length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : "md:grid-cols-3 max-w-5xl mx-auto"
        }`}
      >
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            featured={plans.length > 1 && index === featuredIndex}
          />
        ))}
      </div>
    </section>
  );
}

