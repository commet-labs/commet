import { checkSubscriptionStatus } from "@/actions/check-subscription-action";
import { getPortalUrl } from "@/actions/get-portal-url-action";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { SubscribeButton } from "@/components/subscribe-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageEventButton } from "@/components/usage-event-button";
import { auth } from "@/lib/auth";
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
  const portalAccess = await getPortalUrl();
  const portalUrl = portalAccess.success ? portalAccess.url : undefined;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            UsageSaaS
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
                      Your subscription is now active.
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
                Manage your subscription and billing.
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
                          <p>
                            <strong>Status:</strong>{" "}
                            <Badge variant="secondary">
                              {subscription.status}
                            </Badge>
                          </p>
                          {subscription.daysRemaining !== undefined && (
                            <p>
                              <strong>Days remaining:</strong>{" "}
                              {subscription.daysRemaining}
                            </p>
                          )}
                        </div>
                        <ManageBillingButton portalUrl={portalUrl} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                  <CardContent className="pt-6 space-y-4">
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
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">Plan Pro pendiente</h3>
                        <p className="text-sm text-muted-foreground">
                          Ve al checkout del plan <strong>pro</strong> y vuelve
                          aquí automáticamente cuando completes el pago.
                        </p>
                      </div>
                    </div>
                    <SubscribeButton />
    
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

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
                <h3 className="text-lg font-semibold mb-2">Usage Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  View detailed analytics and insights about your usage patterns
                  and billing.
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
                <p className="text-muted-foreground text-sm mb-6">
                  Manage your account settings and billing preferences.
                </p>
                <ManageBillingButton portalUrl={portalUrl} />

              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Enviar evento de uso</h3>
                <p className="text-muted-foreground text-sm">
                  Dispara un evento <code>api_call</code> con amount 1.
                </p>
        
                <UsageEventButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

