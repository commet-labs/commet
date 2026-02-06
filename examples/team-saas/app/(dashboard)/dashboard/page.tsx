import { checkSubscriptionStatusAction } from "@/actions/team";
import { getPortalUrlAction } from "@/actions/portal";
import { SeatUsageCard } from "@/components/billing/seat-usage-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const status = await checkSubscriptionStatusAction();

  let portalUrl: string | null = null;
  if (status.isPaid) {
    const portalResult = await getPortalUrlAction();
    portalUrl = portalResult.success && portalResult.portalUrl ? portalResult.portalUrl : null;
  }

  return (
    <section className="flex-1 p-4 lg:p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your team and subscription</p>
        </div>

        {status.isPaid ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <SeatUsageCard
                used={status.seatsUsed}
                included={status.seatsIncluded}
                overagePrice={status.seatOveragePrice}
              />

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {status.planName} Plan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {status.daysRemaining} days remaining in current period
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/billing">View Billing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Quick Actions</h3>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start gap-2" asChild>
                      <Link href="/dashboard/team">
                        <Users className="h-4 w-4" />
                        Manage Team Members
                      </Link>
                    </Button>
                    {portalUrl && (
                      <Button variant="outline" className="justify-start gap-2" asChild>
                        <Link href={portalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open Billing Portal
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground mb-2">
                No Active Subscription
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to a plan to start inviting team members and managing seats.
              </p>
              <Button asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
