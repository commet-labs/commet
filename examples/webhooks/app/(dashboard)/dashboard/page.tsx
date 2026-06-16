import { Lock } from "lucide-react";
import Link from "next/link";
import { AutoRefresh } from "@/components/auto-refresh";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { resolveEntitlementsForPlan } from "@/lib/billing/entitlements";
import { getBillingStateForUser } from "@/lib/db/queries";

const MONTHLY_CHART_BARS = [
  { month: "Jan", height: 40 },
  { month: "Feb", height: 65 },
  { month: "Mar", height: 30 },
  { month: "Apr", height: 80 },
  { month: "May", height: 55 },
  { month: "Jun", height: 70 },
  { month: "Jul", height: 45 },
  { month: "Aug", height: 90 },
  { month: "Sep", height: 60 },
  { month: "Oct", height: 75 },
  { month: "Nov", height: 35 },
  { month: "Dec", height: 85 },
];

function formatPeriodEnd(periodEnd: Date | null): string {
  if (!periodEnd) return "—";
  return periodEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const user = await getUser();
  const billing = await getBillingStateForUser(user!.id);
  const entitlements = resolveEntitlementsForPlan(billing.planKey);
  const analyticsUnlocked =
    entitlements.advancedAnalytics && !billing.isPastDue;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AutoRefresh seconds={4} />
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Everything below reads local state synced by webhooks — no Commet API
          call on this page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              Updated by subscription.activated, plan_changed and canceled.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-medium">
                {billing.planName ?? "Free"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium capitalize">
                {billing.isPastDue
                  ? "Past due"
                  : (billing.subscriptionStatus ?? "No subscription")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Current period ends
              </span>
              <span className="text-sm font-medium">
                {formatPeriodEnd(billing.currentPeriodEnd)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project limit</CardTitle>
            <CardDescription>
              Local entitlement derived from your plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">
              {entitlements.projectLimit}
            </span>
            <span className="text-sm text-muted-foreground">
              {entitlements.projectLimit === 1 ? "project" : "projects"}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced analytics</CardTitle>
          <CardDescription>
            A premium feature gated by your local billing state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div
              className={
                analyticsUnlocked
                  ? "flex h-40 items-end gap-2"
                  : "flex h-40 items-end gap-2 blur-[3px]"
              }
            >
              {MONTHLY_CHART_BARS.map((bar) => (
                <div
                  key={bar.month}
                  className="flex-1 bg-primary/80"
                  style={{ height: `${bar.height}%` }}
                />
              ))}
            </div>
            {!analyticsUnlocked && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/60">
                <Lock className="size-5 text-muted-foreground" />
                {billing.isPastDue ? (
                  <>
                    <p className="text-sm font-medium">
                      Paused — payment failed
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      // biome-ignore lint/a11y/useAnchorContent: renders children via Button
                      render={<a href="/api/commet/portal" />}
                    >
                      Update payment method
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Upgrade to Pro to unlock
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={<Link href="/pricing" />}
                    >
                      View plans
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
