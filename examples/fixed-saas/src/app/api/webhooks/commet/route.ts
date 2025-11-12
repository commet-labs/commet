import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Commet Webhook Handler
 *
 * This endpoint will receive webhook events from Commet when subscription
 * status changes (e.g., payment successful, subscription canceled, etc.)
 *
 * 🚧 CURRENT STATUS: Placeholder implementation
 *
 * Expected webhook payload from Commet:
 * {
 *   "event": "subscription.paid" | "subscription.canceled" | "subscription.updated",
 *   "subscriptionId": "sub_xxx",
 *   "customerId": "cus_xxx",
 *   "status": "active" | "canceled" | "past_due",
 *   "timestamp": "2024-01-01T00:00:00Z"
 * }
 *
 * Security:
 * - Webhook signature verification (COMMET_WEBHOOK_SECRET)
 * - Idempotency handling
 * - IP allowlist (optional)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify webhook signature
    // const signature = request.headers.get("x-commet-signature");
    // const webhookSecret = process.env.COMMET_WEBHOOK_SECRET;
    // if (!verifySignature(payload, signature, webhookSecret)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const payload = await request.json();

    console.log("Received Commet webhook:", payload);

    // Validate payload structure
    if (!payload.event || !payload.subscriptionId) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // Handle different webhook events
    switch (payload.event) {
      case "subscription.paid":
      case "subscription.active":
        await handleSubscriptionActivated(payload);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(payload);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(payload);
        break;

      default:
        console.log(`Unhandled webhook event: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Handle subscription activation (payment successful)
 */
async function handleSubscriptionActivated(payload: {
  subscriptionId: string;
  customerId?: string;
  externalId?: string;
}) {
  try {
    // Get subscription details from Commet
    const subscription = await commet.subscriptions.retrieve(
      payload.subscriptionId,
    );

    if (!subscription.success || !subscription.data) {
      throw new Error("Failed to retrieve subscription");
    }

    const customerId = subscription.data.customerId;

    // Get customer details to find the user
    const customer = await commet.customers.retrieve(
      customerId as `cus_${string}`,
    );

    if (!customer.success || !customer.data) {
      throw new Error("Failed to retrieve customer");
    }

    const externalId = customer.data.externalId;

    if (!externalId) {
      console.error("Customer has no externalId (user ID)");
      return;
    }

    // Update user's isPaid status in Better Auth
    // Note: Better Auth doesn't have a direct update API in server context
    // In production, you'd update the database directly or use Better Auth's admin API
    console.log(
      `User ${externalId} subscription activated: ${payload.subscriptionId}`,
    );

    // TODO: Update user record in database
    // await db.update(users).set({ isPaid: true, subscriptionId: payload.subscriptionId }).where(eq(users.id, externalId));
  } catch (error) {
    console.error("Error handling subscription activation:", error);
    throw error;
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(payload: {
  subscriptionId: string;
}) {
  console.log(`Subscription canceled: ${payload.subscriptionId}`);

  // TODO: Update user's isPaid status to false
  // Get subscription -> Get customer -> Get externalId -> Update user
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(payload: {
  subscriptionId: string;
}) {
  console.log(`Subscription updated: ${payload.subscriptionId}`);

  // TODO: Handle plan changes, quantity updates, etc.
}
