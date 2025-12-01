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

export default async function PendingCheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Get subscription for this user
  const result = await commet.subscriptions.get({
    externalId: session.user.id,
  });

  if (!result.success || !result.data) {
    redirect("/checkout");
  }

  const subscription = result.data;

  if (subscription.status === "active" || subscription.status === "trialing") {
    redirect("/dashboard");
  }

  if (subscription.status !== "pending_payment") {
    redirect("/checkout");
  }

  const checkoutUrl = subscription.checkoutUrl;

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
                <p className="font-semibold">{subscription.plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${subscription.plan.basePrice / 100}/
                  {subscription.plan.billingInterval}
                </p>
              </div>
            </div>
          </div>

          {checkoutUrl ? (
            <Button asChild className="w-full">
              <a href={checkoutUrl}>Complete Payment</a>
            </Button>
          ) : (
            <Card className="border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  The checkout URL is not available yet. Please try again later.
                </p>
              </CardContent>
            </Card>
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
