import { SubscribeButton } from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check existing subscription
  const existing = await commet.subscriptions.get({
    externalId: session.user.id,
  });

  if (existing.data) {
    if (
      existing.data.status === "active" ||
      existing.data.status === "trialing"
    ) {
      redirect("/dashboard");
    }

    if (existing.data.status === "pending_payment") {
      redirect(`/checkout/pending?subscriptionId=${existing.data.id}`);
    }
  }

  // Get plan details from Commet
  const planResult = await commet.plans.get("team");

  if (!planResult.success || !planResult.data) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Configuration Required
              </h1>
              <p className="text-muted-foreground mb-6">
                Create a plan with code{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">team</code>{" "}
                in your Commet dashboard with seat-based pricing.
              </p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = planResult.data;

  // Find seat feature
  const seatFeature = plan.features.find((f) => f.type === "seats");

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">Start Your Team</CardTitle>
            <p className="text-muted-foreground">
              Subscribe to start collaborating with your team
            </p>
          </CardHeader>

          <CardContent>
            <div className="border-t border-b py-6 mb-6">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                {plan.prices.length === 1 && plan.prices[0] && (
                  <p className="text-2xl font-bold mt-1">
                    ${(plan.prices[0].price / 100).toFixed(0)}
                    <span className="text-sm text-muted-foreground font-normal">
                      /
                      {plan.prices[0].billingInterval === "yearly"
                        ? "year"
                        : plan.prices[0].billingInterval === "quarterly"
                          ? "quarter"
                          : "month"}
                    </span>
                  </p>
                )}
              </div>

              {plan.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
              )}

              {/* Highlight seat feature */}
              {seatFeature && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">Team Members</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {seatFeature.includedAmount} seats included
                    {seatFeature.overageUnitPrice && (
                      <>
                        , then $
                        {(seatFeature.overageUnitPrice / 100).toFixed(0)}/seat
                      </>
                    )}
                  </p>
                </div>
              )}

              {plan.features.length > 0 && (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features
                    .filter((f) => f.type !== "seats")
                    .map((feature) => (
                      <li key={feature.code} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature.name}
                      </li>
                    ))}
                </ul>
              )}

              {plan.trialDays > 0 && (
                <p className="text-sm text-primary mt-4">
                  {plan.trialDays}-day free trial included
                </p>
              )}
            </div>

            <SubscribeButton prices={plan.prices} planCode="team" />

            <div className="mt-6 text-center">
              <Button variant="link" asChild>
                <Link href="/">← Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

