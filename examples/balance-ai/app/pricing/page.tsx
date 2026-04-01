import { Check } from "lucide-react";
import { redirect } from "next/navigation";
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
        redirect("/dashboard");
      }
    }
  }

  const result = await commet.plans.list();
  const plans =
    result.success && result.data ? result.data.filter((p) => p.isPublic) : [];

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="mb-12 flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Balance-based plans for AI products. Pay for what you use, with your
          balance recharged every billing cycle.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No plans available yet. Configure plans in your Commet dashboard.
        </p>
      ) : (
        <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const monthlyPrice = plan.prices.find(
              (p) => p.billingInterval === "monthly",
            );

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
                      {monthlyPrice ? formatPrice(monthlyPrice.price) : "Free"}
                    </span>
                    {monthlyPrice && (
                      <span className="text-sm text-muted-foreground">/mo</span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.code}
                        className="flex items-center gap-2"
                      >
                        <Check className="size-4 text-muted-foreground" />
                        <span>
                          {feature.name}
                          {feature.unlimited && " (unlimited)"}
                          {feature.includedAmount && !feature.unlimited
                            ? ` — ${feature.includedAmount.toLocaleString()} ${feature.unitName ?? "units"} included`
                            : ""}
                        </span>
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
