import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PendingCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionId?: string }>;
}) {
  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const subscriptionId = params.subscriptionId;

  if (!subscriptionId) {
    redirect("/checkout");
  }

  // Get subscription details
  const subscriptionResult = await commet.subscriptions.retrieve(subscriptionId);

  if (!subscriptionResult.success || !subscriptionResult.data) {
    redirect("/checkout");
  }

  const subscription = subscriptionResult.data;

  // If subscription is active, redirect to dashboard
  if (subscription.status === "active") {
    redirect("/dashboard");
  }

  // If subscription is not pending, redirect to checkout
  if (subscription.status !== "pending_payment") {
    redirect("/checkout");
  }

  const checkoutUrl = (subscription as { checkoutUrl?: string }).checkoutUrl;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Your subscription is ready. Complete the payment to activate your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Pro Plan</p>
                <p className="text-sm text-muted-foreground">$50/month</p>
              </div>
            </div>
          </div>

          {checkoutUrl ? (
            <Button asChild className="w-full">
              <a href={checkoutUrl}>Complete Payment</a>
            </Button>
          ) : (
            <div className="space-y-4">
              <Card className="border-yellow-500/50 bg-yellow-500/10">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">
                        Payment URL Not Available
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        The checkout URL is not yet available. This feature is
                        still being implemented.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  For now, use the demo simulator
                </p>
                <form action="/api/webhooks/commet/simulate" method="POST">
                  <input
                    type="hidden"
                    name="subscriptionId"
                    value={subscription.id}
                  />
                  <input type="hidden" name="userId" value={session.user.id} />
                  <Button
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                  >
                    Simulate Payment (Demo Only)
                  </Button>
                </form>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button variant="link" asChild>
              <Link href="/dashboard">← Go to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

