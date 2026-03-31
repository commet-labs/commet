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

export default async function BillingPage() {
  const billingResult = await getBillingDataAction();
  const subscription = billingResult.data?.subscription || null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {subscription ? (
              <>
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
                <Button
                  variant="outline"
                  className="mt-2"
                  nativeButton={false}
                  render={<Link href="/pricing" />}
                >
                  Change plan
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  No active subscription.
                </p>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/pricing" />}
                >
                  View plans
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Portal</CardTitle>
            <CardDescription>
              Update payment methods, view invoices, and manage your
              subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/api/commet/portal" />}
            >
              Open portal
              <ExternalLink className="size-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
