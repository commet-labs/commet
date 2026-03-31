import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getBillingDataAction } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatBillingInterval(
  interval: "monthly" | "quarterly" | "yearly" | null,
): string {
  if (interval === null) return "free";
  if (interval === "monthly") return "month";
  if (interval === "quarterly") return "quarter";
  return "year";
}

export default async function DashboardPage() {
  const user = await getUser();
  const billingResult = await getBillingDataAction();
  const subscription = billingResult.data?.subscription || null;

  let portalUrl: string | null = null;
  if (
    user &&
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing")
  ) {
    const portalResult = await commet.portal.getUrl({ externalId: user.id });
    if (portalResult.success && portalResult.data?.portalUrl) {
      portalUrl = portalResult.data.portalUrl;
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your subscription and account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {subscription ? (
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan and status.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium">
                  {subscription.planName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium capitalize">
                  {subscription.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-sm font-medium">
                  {formatPrice(subscription.planPrice)} /{" "}
                  {formatBillingInterval(subscription.billingInterval)}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>No active subscription.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/pricing"
                  className="text-foreground underline underline-offset-4"
                >
                  Subscribe to a plan
                </Link>{" "}
                to get started.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Customer Portal</CardTitle>
            <CardDescription>
              Manage payment methods, invoices, and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portalUrl ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Open portal
                <ExternalLink className="size-3" />
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Available once you have an active subscription.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
