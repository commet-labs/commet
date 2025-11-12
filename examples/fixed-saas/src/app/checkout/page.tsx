import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Ensure customer exists in Commet
  try {
    const customerCheck = await commet.customers.list({
      externalId: user.id,
    });

    // Create customer if doesn't exist
    if (
      !customerCheck.success ||
      !customerCheck.data ||
      customerCheck.data.length === 0
    ) {
      await commet.customers.create({
        externalId: user.id,
        legalName: user.name || user.email,
        billingEmail: user.email,
        taxStatus: "NOT_APPLICABLE",
        currency: "USD",
      });
    }
  } catch (error) {
    console.error("Failed to ensure Commet customer:", error);
    // Continue anyway - subscription creation will fail if customer doesn't exist
  }

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

    // If pending subscription exists, use it instead of creating a new one
    const pendingSubscription = existingSubscriptions.data.find(
      (sub) => sub.status === "pending_payment" && sub.checkoutUrl,
    );
    if (pendingSubscription) {
      // Reuse existing pending subscription
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
              <Button asChild className="w-full">
                <a href={pendingSubscription.checkoutUrl}>
                  Complete Payment
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
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

  // Create a new subscription
  try {
    const subscriptionResult = await commet.subscriptions.create({
      externalId: user.id,
      items: [
        {
          priceId: COMMET_PRICE_ID,
          quantity: 1,
        },
      ],
      status: "pending_payment", // Generates checkout URL
    });

    if (!subscriptionResult.success || !subscriptionResult.data) {
      throw new Error("Failed to create subscription");
    }

    const subscription = subscriptionResult.data;

    // 🔍 DISCOVERY: Check if checkoutUrl exists in the response
    // According to the API response analysis, it does NOT exist yet
    const checkoutUrl = (subscription as { checkoutUrl?: string }).checkoutUrl;

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
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
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

              {checkoutUrl ? (
                // If checkoutUrl exists (future state)
                <div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Click below to complete your payment securely with Commet
                  </p>
                  <Button size="lg" className="w-full" asChild>
                    <a href={checkoutUrl}>Proceed to Payment</a>
                  </Button>
                </div>
              ) : (
                // Current state: checkoutUrl doesn't exist yet
                <div className="space-y-4">
                  <Card className="border-yellow-500/50 bg-yellow-500/10">
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <svg
                          className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
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
                            Missing Feature: Checkout URL
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            The Commet subscription was created (ID:{" "}
                            {subscription.id}), but the API response doesn't
                            include a{" "}
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">
                              checkoutUrl
                            </code>
                            .
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-6">
                      <h3 className="text-sm font-semibold mb-2">
                        📝 Expected Behavior
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        After creating a subscription, the API should return:
                      </p>
                      <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                        {`{
  "success": true,
  "data": {
    "id": "${subscription.id}",
    "status": "pending_payment",
    "checkoutUrl": "https://checkout.commet.co/..."
  }
}`}
                      </pre>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      For now, we'll simulate the payment flow
                    </p>
                    <form action="/api/webhooks/commet/simulate" method="POST">
                      <input
                        type="hidden"
                        name="subscriptionId"
                        value={subscription.id}
                      />
                      <input type="hidden" name="userId" value={user.id} />
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

                  <div className="text-center">
                    <Button variant="link" asChild>
                      <Link href="/">← Back to home</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Subscription ID: {subscription.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Checkout error:", error);

    // Better error messages based on error type
    let errorMessage = "An unexpected error occurred";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for common errors
      if (errorMessage.includes("not found") || errorMessage.includes("404")) {
        errorMessage = "Price ID not found in Commet";
        errorDetails = `The price ID "${COMMET_PRICE_ID}" doesn't exist in your Commet dashboard.`;
      } else if (errorMessage.includes("customer")) {
        errorMessage = "Customer not found";
        errorDetails =
          "The Commet customer wasn't created properly during signup.";
      } else if (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("401")
      ) {
        errorMessage = "Invalid API credentials";
        errorDetails = "Check your COMMET_API_KEY in .env file.";
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Checkout Error</h1>
              <p className="font-medium mb-2">{errorMessage}</p>
              {errorDetails && (
                <p className="text-muted-foreground text-sm mb-4">
                  {errorDetails}
                </p>
              )}
              <Card className="bg-muted mb-6 text-left">
                <CardContent className="pt-6">
                  <p className="text-xs font-mono break-all">
                    {error instanceof Error ? error.message : String(error)}
                  </p>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
