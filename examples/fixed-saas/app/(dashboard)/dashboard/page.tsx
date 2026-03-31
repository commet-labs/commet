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

export default async function DashboardPage() {
  const billingResult = await getBillingDataAction();
  const subscription = billingResult.data?.subscription || null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your subscription and account.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              {subscription
                ? "Your current plan and status."
                : "No active subscription."}
            </CardDescription>
          </div>
          {subscription && (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/api/commet/portal" />}
            >
              Manage billing
              <ExternalLink className="size-3" />
            </Button>
          )}
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
            </>
          ) : (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              View plans
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
