import { checkSubscriptionStatus } from "@/actions/check-subscription-action";
import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Check subscription status
  const subscriptionStatus = await checkSubscriptionStatus();

  // Get subscription details if available
  let subscriptionDetails = null;
  if (subscriptionStatus.subscriptionId) {
    const result = await commet.subscriptions.retrieve(
      subscriptionStatus.subscriptionId,
    );
    if (result.success) {
      subscriptionDetails = result.data;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SaaSPro
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {paymentSuccess && (
            <Card className="border-green-500/50 bg-green-500/10">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                      Payment Simulated Successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      In production, this would be triggered by a real Commet
                      webhook.
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
                You're viewing the protected dashboard area of the application.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Subscription Status
                </h2>

                {subscriptionStatus.isPaid ? (
                  <Card className="border-green-500/50 bg-green-500/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-green-500 flex-shrink-0"
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
                            Your Pro plan is active and ready to use.
                          </p>
                          {subscriptionDetails && (
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Subscription ID:</strong>{" "}
                                {subscriptionDetails.id}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <Badge variant="secondary">
                                  {subscriptionDetails.status}
                                </Badge>
                              </p>
                              <p>
                                <strong>Started:</strong>{" "}
                                {new Date(
                                  subscriptionDetails.startDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-yellow-500/50 bg-yellow-500/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-yellow-500 flex-shrink-0"
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
                            Complete your checkout to activate your
                            subscription.
                          </p>
                          <Button asChild>
                            <Link href="/checkout">Complete Checkout</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  View detailed analytics and insights about your usage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Manage your account settings and preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Team</h3>
                <p className="text-muted-foreground text-sm">
                  Invite team members and manage permissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-muted-foreground text-sm">
                  Get help from our dedicated support team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example Integration Info */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">
                💡 About This Example
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                This is a demonstration of Commet's billing integration. This
                example shows:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>User signup with Better Auth</li>
                <li>Automatic Commet customer creation</li>
                <li>Subscription management with the Commet SDK</li>
                <li>Protected routes based on subscription status</li>
                <li>Webhook handling for payment events (when implemented)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
