import { SubscribeButton } from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { COMMET_PRICE_ID, commet } from "@/lib/commet";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // Check if user already has a subscription
  const existingSubscriptions = await commet.subscriptions.list({
    externalId: user.id,
  });

  if (
    existingSubscriptions.success &&
    existingSubscriptions.data &&
    existingSubscriptions.data.length > 0
  ) {
    // If active subscription exists, redirect to dashboard
    const activeSubscription = existingSubscriptions.data.find(
      (sub) => sub.status === "active",
    );
    if (activeSubscription) {
      redirect("/dashboard");
    }

    // If pending subscription exists, redirect to pending page
    const pendingSubscription = existingSubscriptions.data.find(
      (sub) => sub.status === "pending_payment",
    );
    if (pendingSubscription) {
      redirect(`/checkout/pending?subscriptionId=${pendingSubscription.id}`);
    }
  }

  // Validate COMMET_PRICE_ID
  if (COMMET_PRICE_ID === "build_placeholder" || !COMMET_PRICE_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Configuration Required
              </h1>
              <p className="text-muted-foreground mb-6">
                Please configure{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  COMMET_PRICE_ID
                </code>{" "}
                in your{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">.env</code>{" "}
                file with a valid price ID from your Commet dashboard.
              </p>
              <Card className="border-primary/50 bg-primary/5 mb-6 text-left">
                <CardContent className="pt-6">
                  <p className="text-sm font-semibold mb-2">
                    How to get your Price ID:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Go to your Commet dashboard</li>
                    <li>Navigate to Products</li>
                    <li>Create or select a product</li>
                    <li>Copy the Price ID</li>
                    <li>Update COMMET_PRICE_ID in .env</li>
                  </ol>
                </CardContent>
              </Card>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show checkout page
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl mb-2">
              Complete Your Purchase
            </CardTitle>
            <p className="text-muted-foreground">
              You're one step away from accessing SaaSPro
            </p>
          </CardHeader>

          <CardContent>
            <div className="border-t border-b py-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Pro Plan</span>
                <span className="text-2xl font-bold">
                  $50
                  <span className="text-sm text-muted-foreground">/month</span>
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full platform access
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced analytics
                </li>
              </ul>
            </div>

            <SubscribeButton />

            <div className="mt-6 text-center">
              <Button variant="link" asChild>
                <Link href="/">← Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
