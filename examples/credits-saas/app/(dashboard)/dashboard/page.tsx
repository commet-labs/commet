import { trackUsageAction } from "@/app/actions/credits";
import { getUsageDataAction } from "@/app/actions/usage";
import { getPortalUrlAction } from "@/app/actions/portal";
import { TransactionHistory } from "@/components/billing/TransactionHistory";
import { UsageMeter } from "@/components/billing/UsageMeter";
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
    <section className="flex-1 p-4 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Overview of your usage and activity</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Usage Meters */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-700" />
              Active Features
            </h2>
            <div className="grid gap-6">
              {usageData && usageData.hasSubscription && usageData.features.length > 0 ? (
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
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 text-center">
                      No active subscription.{" "}
                      <Link
                        href="/pricing"
                        className="text-gray-900 font-medium hover:underline"
                      >
                        Subscribe to a plan
                      </Link>{" "}
                      to start tracking usage.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 text-center">
                      Unable to load usage data. Please try again later.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Simulated Action Card */}
            <Card className="shadow-sm border-gray-200 bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900">
                  <Zap className="w-4 h-4 text-gray-700" />
                  Try AI Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Simulate using 50 credits to generate an image. This will
                  deduct from your balance.
                </p>
                <form
                  action={async () => {
                    "use server";
                    await trackUsageAction("ai_generation", 50);
                  }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 shadow-sm"
                  >
                    Generate Image (50 Credits)
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Billing Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" />
              Recent Activity
            </h2>
            {portalUrl ? (
              <>
                <TransactionHistory transactions={transactions} />
                <Card className="shadow-sm border-gray-100 bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          View Full Billing History
                        </p>
                        <p className="text-xs text-gray-500">
                          Access invoices and payment history in the Commet portal
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
