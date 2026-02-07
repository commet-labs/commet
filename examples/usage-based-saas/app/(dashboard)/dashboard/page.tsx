import { trackUsageAction } from "@/actions/credits";
import { getUsageDataAction } from "@/actions/usage";
import { getPortalUrlAction } from "@/actions/portal";
import { TransactionHistory } from "@/components/billing/transaction-history";
import { UsageMeter } from "@/components/billing/usage-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Info, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Get real usage data from Commet SDK
  const usageResult = await getUsageDataAction();
  const portalResult = await getPortalUrlAction();

  const usageData = usageResult.success ? usageResult.data : null;
  const portalUrl = portalResult.success ? portalResult.portalUrl : null;
  const tryFeatures = usageData?.features ?? [];

  // For now, show empty transactions array since invoices are not available via SDK
  // Users can view billing history in the Commet portal
  const transactions: {
    id: string;
    date: string;
    amount: string;
    status: "Paid" | "Pending" | "Failed";
    type: "Subscription" | "Credit Pack" | "Usage";
    description: string;
  }[] = [];

  return (
    <section className="flex-1 p-4 lg:p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your usage and activity</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Usage Meters */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-foreground" />
              Active Features
            </h2>
            <div className="grid gap-6">
              {usageData?.hasSubscription && usageData.features.length > 0 ? (
                usageData.features.map((feature) => (
                  <UsageMeter
                    key={feature.code}
                    title={feature.name}
                    used={feature.current}
                    total={feature.included}
                    unit={feature.unit}
                  />
                ))
              ) : usageData && !usageData.hasSubscription ? (
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
                      to start tracking usage.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm border-border">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Unable to load usage data. Please try again later.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {usageData?.hasSubscription && tryFeatures.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Try Features
                </h3>
                <div className="grid gap-4">
                  {tryFeatures.map((feature) => (
                    <Card key={feature.code} className="shadow-sm border-border bg-secondary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
                          Try {feature.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Send a usage event to Commet for{" "}
                          <span className="font-medium">{feature.name}</span>. Your usage will update
                          based on your plan configuration.
                        </p>
                        <form
                          action={async () => {
                            "use server";
                            await trackUsageAction(feature.code, 1);
                          }}
                        >
                          <Button
                            type="submit"
                            className="w-full bg-card text-foreground border border-border hover:bg-accent shadow-sm"
                          >
                            Use {feature.name}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Billing Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Info className="w-5 h-5 text-muted-foreground" />
              Manage Billing
            </h2>
            {portalUrl ? (
              <>
                <Card className="shadow-sm border-border bg-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Customer Portal
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Manage your subscription, view usage, update payment
                          methods, and access invoices in the Commet portal.
                        </p>
                      </div>
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
                <TransactionHistory transactions={transactions} />

              </>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
