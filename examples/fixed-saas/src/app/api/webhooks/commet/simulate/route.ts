import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Simulate Payment Success
 *
 * This is a demo endpoint that simulates a successful payment webhook from Commet.
 * In production, this would be replaced by actual Commet webhook events.
 *
 * This demonstrates what the flow SHOULD be once Commet implements:
 * 1. checkoutUrl in subscription response
 * 2. Webhook events for payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const subscriptionId = formData.get("subscriptionId") as string;
    const userId = formData.get("userId") as string;

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, Commet would:
    // 1. Process payment on their checkout page
    // 2. Update subscription status to "active"
    // 3. Send webhook to our endpoint: POST /api/webhooks/commet
    // 4. We update user's isPaid status

    // For demo, we'll just redirect to dashboard
    // The user would need to manually check subscription status
    console.log("Simulated payment for subscription:", subscriptionId);
    console.log("User:", userId);

    // Redirect to dashboard with success message
    redirect("/dashboard?payment=success");
  } catch (error) {
    console.error("Simulate payment error:", error);

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return NextResponse.json(
      { error: "Payment simulation failed" },
      { status: 500 },
    );
  }
}
