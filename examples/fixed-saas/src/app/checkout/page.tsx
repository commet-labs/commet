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

  if (existingSubscriptions.success && existingSubscriptions.data && existingSubscriptions.data.length > 0) {
    const activeSubscription = existingSubscriptions.data.find(
      (sub) => sub.status === "active",
    );
    if (activeSubscription) {
      redirect("/dashboard");
    }
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
                        The Commet subscription was created (ID: {subscription.id}),
                        but the API response doesn't include a <code className="bg-yellow-100 px-1 py-0.5 rounded">checkoutUrl</code>.
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
                    <input type="hidden" name="subscriptionId" value={subscription.id} />
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
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
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
}

