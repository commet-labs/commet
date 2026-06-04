import { ExternalLink } from "lucide-react";
import {
  type BillingSubscription,
  getBillingDataAction,
} from "@/actions/billing";
import { getTaskQuotaStatusAction } from "@/actions/tasks";
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
  interval: BillingSubscription["billingInterval"],
): string {
  if (interval === null) return "free";
  if (interval === "weekly") return "week";
  if (interval === "monthly") return "month";
  if (interval === "quarterly") return "quarter";
  return "year";
}

export default async function BillingPage() {
  const [billingResult, quotaStatus] = await Promise.all([
    getBillingDataAction(),
    getTaskQuotaStatusAction(),
  ]);
  const subscription = billingResult.data?.subscription;
  const taskOverage =
    !quotaStatus.unlimited && quotaStatus.billed > quotaStatus.included
      ? quotaStatus.billed - quotaStatus.included
      : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription and payment details.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and status.</CardDescription>
          </div>
          {subscription && (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              // biome-ignore lint/a11y/useAnchorContent: renders children via Button
              render={
                <a
                  href="/api/commet/portal"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tasks used
                </span>
                <span className="text-sm font-medium">
                  {quotaStatus.used.toLocaleString()} of{" "}
                  {quotaStatus.included.toLocaleString()} included
                </span>
              </div>
              {taskOverage > 0 &&
                quotaStatus.overagePricePerTask !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-destructive">
                      Overage ({taskOverage.toLocaleString()} tasks)
                    </span>
                    <span className="text-sm font-medium text-destructive">
                      +$
                      {(
                        taskOverage * quotaStatus.overagePricePerTask
                      ).toFixed(2)}
                      /mo
                    </span>
                  </div>
                )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active subscription.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
