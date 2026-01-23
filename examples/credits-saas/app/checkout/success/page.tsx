import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutSuccessPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get subscription status
  const subscriptionResult = await commet.subscriptions.get(user.id);
  const subscription = subscriptionResult.data;

  // If no subscription or still pending, show loading state
  const isProcessing =
    !subscription ||
    subscription.status === "pending_payment" ||
    subscription.status === "draft";

  return (
    <main className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-lg border-gray-100">
        <CardHeader className="text-center pb-4">
          {isProcessing ? (
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
          ) : (
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isProcessing ? "Processing Payment..." : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isProcessing ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We're confirming your payment with our payment processor. This
                usually takes just a few seconds.
              </p>
              <p className="text-sm text-gray-500">
                Your subscription will be activated automatically once the
                payment is confirmed.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Your subscription to{" "}
                  <span className="font-semibold text-gray-900">
                    {subscription?.plan.name}
                  </span>{" "}
                  has been activated.
                </p>
                {subscription?.status === "trialing" &&
                  subscription.trialEndsAt && (
                    <p className="text-sm text-gray-500">
                      Your trial ends on{" "}
                      {new Date(subscription.trialEndsAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">
                    {subscription?.plan.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium text-gray-900">
                    ${(subscription?.plan.basePrice ?? 0) / 100}/
                    {subscription?.plan.billingInterval === "monthly"
                      ? "month"
                      : subscription?.plan.billingInterval === "yearly"
                        ? "year"
                        : "quarter"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600 capitalize">
                    {subscription?.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full h-12 text-base" size="lg">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Link href="/dashboard/billing">View Billing Details</Link>
                </Button>
              </div>
            </>
          )}

          {isProcessing && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                This page will automatically refresh when your payment is
                confirmed. If this takes longer than expected, please{" "}
                <Link
                  href="/dashboard"
                  className="text-gray-900 font-medium hover:underline"
                >
                  go to your dashboard
                </Link>
                .
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
