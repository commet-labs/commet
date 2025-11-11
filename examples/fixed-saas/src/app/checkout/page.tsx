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
    if (!customerCheck.success || !customerCheck.data || customerCheck.data.length === 0) {
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
    const activeSubscription = existingSubscriptions.data.find(
      (sub) => sub.status === "active",
    );
    if (activeSubscription) {
      redirect("/dashboard");
    }
  }

  // Validate COMMET_PRICE_ID
  if (COMMET_PRICE_ID === "build_placeholder" || !COMMET_PRICE_ID) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Configuration Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please configure{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                COMMET_PRICE_ID
              </code>{" "}
              in your{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file
              with a valid price ID from your Commet dashboard.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 mb-2 font-semibold">
                How to get your Price ID:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to your Commet dashboard</li>
                <li>Navigate to Products</li>
                <li>Create or select a product</li>
                <li>Copy the Price ID</li>
                <li>Update COMMET_PRICE_ID in .env</li>
              </ol>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
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
      status: "draft", // Keep as draft until payment
    });

    if (!subscriptionResult.success || !subscriptionResult.data) {
      throw new Error("Failed to create subscription");
    }

    const subscription = subscriptionResult.data;

    // 🔍 DISCOVERY: Check if checkoutUrl exists in the response
    // According to the API response analysis, it does NOT exist yet
    const checkoutUrl = (subscription as { checkoutUrl?: string }).checkoutUrl;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-gray-600">
                You're one step away from accessing SaaSPro
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Pro Plan</span>
                <span className="text-2xl font-bold text-gray-900">
                  $50<span className="text-sm text-gray-500">/month</span>
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
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
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Click below to complete your payment securely with Commet
                </p>
                <a
                  href={checkoutUrl}
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Proceed to Payment
                </a>
              </div>
            ) : (
              // Current state: checkoutUrl doesn't exist yet
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                      <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                        Missing Feature: Checkout URL
                      </h3>
                      <p className="text-sm text-yellow-700">
                        The Commet subscription was created (ID:{" "}
                        {subscription.id}), but the API response doesn't include
                        a{" "}
                        <code className="bg-yellow-100 px-1 py-0.5 rounded">
                          checkoutUrl
                        </code>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    📝 Expected Behavior
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    After creating a subscription, the API should return:
                  </p>
                  <pre className="bg-blue-100 text-blue-900 p-2 rounded text-xs overflow-x-auto">
                    {`{
  "success": true,
  "data": {
    "id": "${subscription.id}",
    "status": "draft",
    "checkoutUrl": "https://checkout.commet.co/..."
  }
}`}
                  </pre>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    For now, we'll simulate the payment flow
                  </p>
                  <form action="/api/webhooks/commet/simulate" method="POST">
                    <input
                      type="hidden"
                      name="subscriptionId"
                      value={subscription.id}
                    />
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Simulate Payment (Demo Only)
                    </button>
                  </form>
                </div>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Back to home
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Subscription ID: {subscription.id}
              </p>
            </div>
          </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Checkout Error
            </h1>
            <p className="text-gray-800 font-medium mb-2">{errorMessage}</p>
            {errorDetails && (
              <p className="text-gray-600 text-sm mb-4">{errorDetails}</p>
            )}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-gray-700 font-mono break-all">
                {error instanceof Error ? error.message : String(error)}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
