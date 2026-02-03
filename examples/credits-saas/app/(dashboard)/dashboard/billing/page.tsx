import { getBillingDataAction } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatBillingInterval(
  interval: "monthly" | "quarterly" | "yearly",
): string {
  if (interval === "monthly") return "month";
  if (interval === "quarterly") return "quarter";
  return "year";
}

export default async function BillingPage() {
  const billingResult = await getBillingDataAction();

  const subscription = billingResult.data?.subscription || null;

  return (
    <section className="flex-1 p-4 lg:p-8 bg-secondary/50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Billing & Invoices
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods and view history
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Payment Method - Always show, empty state if no subscription */}
          <Card className="md:col-span-2 shadow-sm border-border">
            <CardHeader className="pb-3 border-b border-border/50 bg-secondary/30">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {subscription ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-orange-400" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        Manage payment method
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Update in portal
                      </div>
                    </div>
                  </div>
                  <form action={customerPortalAction}>
                    <Button variant="outline" type="submit" className="gap-2">
                      Manage in Portal
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">
                        No payment method
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Add a payment method to get started
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href="/pricing">Get Started</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Plan - Always show, empty state if no subscription */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3 border-b border-border/50 bg-secondary/30">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {subscription ? (
                <>
                  <div className="text-lg font-bold text-foreground">
                    {subscription.planName}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {formatPrice(subscription.planPrice)} /{" "}
                    {formatBillingInterval(subscription.billingInterval)}
                  </div>
                  <Button variant="outline" className="w-full text-xs h-8" asChild>
                    <Link href="/pricing">Change Plan</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-muted-foreground">
                    No active plan
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Subscribe to a plan to get started
                  </div>
                  <Button variant="outline" className="w-full text-xs h-8" asChild>
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Billing is handled securely
          </p>
        </div>
      </div>
    </section>
  );
}
