import { redirect } from "next/navigation";
import { AutoRefresh } from "@/components/auto-refresh";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import {
  hasUsableSubscription,
  resolveAccessForBillingState,
} from "@/lib/billing/entitlements";
import { getBillingStateForUser } from "@/lib/db/queries";
import type { BillingFeature } from "@/lib/db/schema";

function formatPeriodEnd(periodEnd: Date | null): string {
  if (!periodEnd) return "—";
  return periodEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(status: string): string {
  if (status === "none") return "No subscription";
  if (status === "past_due") return "Past due";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatFeatureValue(feature: BillingFeature): string {
  if (feature.unlimited) return "Unlimited";
  if (feature.type === "boolean") return feature.enabled ? "Enabled" : "Off";
  if (feature.type === "usage" && typeof feature.remaining === "number") {
    return `${feature.remaining.toLocaleString()} remaining`;
  }
  if (typeof feature.included === "number") {
    return feature.included.toLocaleString();
  }
  if (typeof feature.current === "number") {
    return feature.current.toLocaleString();
  }
  return feature.allowed ? "Included" : "Not included";
}

export default async function DashboardPage() {
  const user = await getUser();
  const billing = await getBillingStateForUser(user!.id);

  if (!hasUsableSubscription(billing?.subscriptionStatus)) {
    redirect("/pricing");
  }

  const access = resolveAccessForBillingState(billing);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AutoRefresh seconds={4} />
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription, renewal date, and included limits.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>Your current subscription.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-medium">{access.planLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium">
                {formatStatus(access.status)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Current period ends
              </span>
              <span className="text-sm font-medium">
                {formatPeriodEnd(billing?.currentPeriodEnd ?? null)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Included limits and access.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {access.features.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No included features for this plan.
              </p>
            ) : (
              access.features.map((feature) => (
                <div
                  key={feature.code}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {feature.name}
                  </span>
                  <span className="text-sm font-medium">
                    {formatFeatureValue(feature)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
