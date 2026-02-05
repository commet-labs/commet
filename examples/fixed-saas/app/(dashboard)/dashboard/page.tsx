import { getBillingDataAction } from "@/actions/billing";
import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Info, Zap } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();
  const billingResult = await getBillingDataAction();

  const subscription = billingResult.data?.subscription || null;

  let portalUrl: string | null = null;
  if (user && subscription && (subscription.status === "active" || subscription.status === "trialing")) {
    const portalResult = await commet.portal.getUrl({ externalId: user.id });
    if (portalResult.success && portalResult.data?.portalUrl) {
      portalUrl = portalResult.data.portalUrl;
    }
  }

  return (
    <section className="flex-1 p-4 lg:p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your subscription</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-foreground" />
            Subscription
          </h2>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            Manage Billing
          </h2>

          {/* Subscription Status */}
          {subscription ? (
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg">{subscription.planName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-sm font-medium text-foreground">
                      ${(subscription.planPrice / 100).toFixed(2)} / {subscription.billingInterval === "monthly" ? "month" : subscription.billingInterval === "quarterly" ? "quarter" : "year"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  No active subscription.{" "}
                  <Link
                    href="/pricing"
                    className="text-foreground font-medium hover:underline"
                  >
                    Subscribe to a plan
                  </Link>{" "}
                  to get started.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Manage Billing */}
          {portalUrl ? (
            <Card className="shadow-sm border-border bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">Customer Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription, update payment methods, and access invoices in the Commet portal.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2"
                    asChild
                  >
                    <Link href={portalUrl} target="_blank" rel="noopener noreferrer">
                      Open Portal
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  Billing portal will be available once you have an active subscription.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
