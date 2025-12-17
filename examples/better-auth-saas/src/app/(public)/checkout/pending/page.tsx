import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionId?: string }>;
}) {
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

  // Check subscription status
  const subscription = await commet.subscriptions.get(session.user.id);

  if (subscription.data) {
    if (
      subscription.data.status === "active" ||
      subscription.data.status === "trialing"
    ) {
      redirect("/dashboard?payment=success");
    }

    if (subscription.data.status === "pending_payment" && subscription.data.checkoutUrl) {
      // Still pending - redirect to checkout
      redirect(subscription.data.checkoutUrl);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl mb-2">Payment Pending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Your subscription is being processed. Please complete the payment to
            activate your account.
          </p>
          <div className="flex gap-2">
            <Link href="/checkout" className="flex-1">
              <button className="w-full py-2 px-4 rounded-lg border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Complete Payment
              </button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <button className="w-full py-2 px-4 rounded-lg border hover:bg-accent transition-colors">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

