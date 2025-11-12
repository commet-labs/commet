import { commet } from "@/lib/commet";
import { db } from "@/lib/db/connection";
import { user } from "@/lib/db/schema";
import type { WebhookPayload } from "@commet/node";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature and parse payload
    const rawBody = await request.text();
    const signature = request.headers.get("x-commet-signature");
    const webhookSecret = process.env.COMMET_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] COMMET_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Use Commet SDK to verify and parse webhook
    const payload = commet.webhooks.verifyAndParse(
      rawBody,
      signature,
      webhookSecret,
    );

    if (!payload) {
      console.error("[Webhook] Invalid signature or payload");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Validate payload structure

    console.log(`[Webhook] Received ${payload.event}:`, {
      subscriptionId: payload.data.subscriptionId,
      customerId: payload.data.customerId,
      externalId: payload.data.externalId,
    });

    if (!payload.event || !payload.data) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // 3. Handle different webhook events
    switch (payload.event) {
      case "subscription.activated":
        await handleSubscriptionActivated(payload);
        break;

      case "subscription.created":
        await handleSubscriptionCreated(payload);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(payload);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(payload);
        break;

      default:
        console.log(`[Webhook] Unhandled event: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Get user ID from webhook payload
 * Tries externalId first, falls back to customerId lookup
 */
async function getUserIdFromPayload(
  payload: WebhookPayload,
): Promise<string | null> {
  // Try externalId first (most efficient)
  if (payload.data.externalId) {
    return payload.data.externalId;
  }

  // Fallback: look up by Commet customer ID
  if (payload.data.customerId) {
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.commetCustomerId, payload.data.customerId))
      .limit(1);

    return existingUser?.id || null;
  }

  return null;
}

/**
 * Handle subscription activation (payment successful)
 * Updates user's isPaid status and stores subscription ID
 */
async function handleSubscriptionActivated(payload: WebhookPayload) {
  try {
    const userId = await getUserIdFromPayload(payload);

    if (!userId) {
      console.error(
        "[Webhook] Cannot find user for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Update user to paid status
    await db
      .update(user)
      .set({
        isPaid: true,
        subscriptionId: payload.data.subscriptionId || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(
      `[Webhook] ✅ User ${userId} subscription activated: ${payload.data.subscriptionId}`,
    );
  } catch (error) {
    console.error("[Webhook] Error handling subscription activation:", error);
    throw error;
  }
}

/**
 * Handle subscription creation
 * Logs the event but doesn't change user status (not yet paid)
 */
async function handleSubscriptionCreated(payload: WebhookPayload) {
  console.log(
    `[Webhook] Subscription created: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
  );
  // No action needed - user will be updated when payment is received
}

/**
 * Handle subscription cancellation
 * Revokes user access by setting isPaid to false
 */
async function handleSubscriptionCanceled(payload: WebhookPayload) {
  try {
    const userId = await getUserIdFromPayload(payload);

    if (!userId) {
      console.error(
        "[Webhook] Cannot find user for subscription:",
        payload.data.subscriptionId,
      );
      return;
    }

    // Revoke access
    await db
      .update(user)
      .set({
        isPaid: false,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(
      `[Webhook] ❌ User ${userId} subscription canceled: ${payload.data.subscriptionId}`,
    );
  } catch (error) {
    console.error("[Webhook] Error handling subscription cancellation:", error);
    throw error;
  }
}

/**
 * Handle subscription updates
 * Currently logs the event - extend as needed for plan changes, quantity updates, etc.
 */
async function handleSubscriptionUpdated(payload: WebhookPayload) {
  console.log(
    `[Webhook] Subscription updated: ${payload.data.subscriptionId} (status: ${payload.data.status})`,
  );

  // If status changed to active, treat as activation
  if (payload.data.status === "active") {
    await handleSubscriptionActivated(payload);
  }
  // If status changed to canceled, treat as cancellation
  else if (payload.data.status === "canceled") {
    await handleSubscriptionCanceled(payload);
  }

  // Handle other updates as needed (plan changes, quantity, etc.)
}
