import { checkSubscriptionStatus } from "@/actions/check-subscription-action";
import { getWorkspaceMembers } from "@/actions/get-workspace-members";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { SeatUsageCard } from "@/components/seat-usage-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { BarChart3, Settings, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const params = await searchParams;
  const paymentSuccess = params.payment === "success";

  const subscription = await checkSubscriptionStatus();
  const members = await getWorkspaceMembers();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            TeamPro
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <form action="/api/auth/sign-out" method="POST">
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {paymentSuccess && (
            <Card className="border-green-500/50 bg-green-500/10">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Payment Successful!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your subscription is now active. Start inviting team
                      members!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                Welcome to Your Dashboard!
              </CardTitle>
              <p className="text-muted-foreground">
                Manage your team and workspace
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Subscription Status
              </h2>

              {subscription.isPaid ? (
                <Card className="border-green-500/50 bg-green-500/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          Active Subscription
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your {subscription.planName} plan is active.
                        </p>
                        <div className="text-sm space-y-1 mb-4">
                          {subscription.daysRemaining !== undefined && (
                            <p>
                              <strong>Days remaining:</strong>{" "}
                              {subscription.daysRemaining}
                            </p>
                          )}
                        </div>
                        <ManageBillingButton />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          No Active Subscription
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Complete your checkout to activate your subscription
                          and start inviting team members.
                        </p>
                        <Button asChild>
                          <Link href="/checkout">Complete Checkout</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Seat Usage Card */}
          <SeatUsageCard
            used={subscription.seatsUsed}
            included={subscription.seatsIncluded}
            overagePrice={subscription.seatOveragePrice}
          />

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <Link href="/team" className="block">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Manage your team and invite new members.
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  View detailed analytics and insights about your team's usage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your workspace settings and preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
