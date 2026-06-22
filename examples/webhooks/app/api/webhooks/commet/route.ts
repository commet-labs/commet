import { createHash } from "node:crypto";
import { type WebhookPayload, Webhooks } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";
import {
  recordCurrentPeriod,
  recordUsageFromEvent,
  resolveActivatedUserForWelcome,
  restoreAccessAfterPayment,
  syncBillingStateFromSnapshot,
} from "@/lib/billing/sync";
import {
  markWebhookEventCompleted,
  markWebhookEventFailed,
  recordWebhookEvent,
} from "@/lib/billing/webhook-events";
import { env } from "@/lib/env";
import { sendWelcomeEmail } from "@/lib/notifications/email";
import { notifyTeamOfNewSubscription } from "@/lib/notifications/team";

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks();
  const rawBody = await request.text();
  const signature = request.headers.get("x-commet-signature");

  const isValid = webhooks.verify({
    payload: rawBody,
    signature,
    secret: env.COMMET_WEBHOOK_SECRET,
  });

  if (!isValid) {
    return NextResponse.json(
      { received: false, error: "Invalid signature" },
      { status: 403 },
    );
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch (error) {
    console.error("[commet-webhook] invalid payload", { error });
    return NextResponse.json(
      { received: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  const eventId = createHash("sha256").update(rawBody).digest("hex");
  const insertResult = await recordWebhookEvent({ eventId, payload });
  if (insertResult === "completed") {
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (insertResult === "processing") {
    return NextResponse.json(
      { received: false, error: "Event is already processing" },
      { status: 400 },
    );
  }

  const criticalHandlers: Promise<void>[] = [];
  const notificationHandlers: Promise<void>[] = [];

  switch (payload.event) {
    case "customer.state_changed":
      criticalHandlers.push(syncBillingStateFromSnapshot(payload.data));
      if (payload.data.trigger === "subscription_activated") {
        notificationHandlers.push(
          resolveActivatedUserForWelcome(payload.data).then((activatedUser) =>
            Promise.all([
              sendWelcomeEmail(activatedUser),
              notifyTeamOfNewSubscription(activatedUser),
            ]).then(() => undefined),
          ),
        );
      }
      break;

    case "subscription.activated":
    case "subscription.reactivated":
      criticalHandlers.push(recordCurrentPeriod(payload.data));
      break;

    case "payment.received":
    case "payment.recovered":
      criticalHandlers.push(restoreAccessAfterPayment(payload.data));
      break;

    case "usage.recorded":
      criticalHandlers.push(recordUsageFromEvent(payload.data));
      break;
  }

  try {
    await Promise.all(criticalHandlers);
  } catch (error) {
    await markWebhookEventFailed(eventId);
    console.error("[commet-webhook] handler failed", { error, payload });
    return NextResponse.json(
      { received: false, error: "Handler failed" },
      { status: 500 },
    );
  }

  await markWebhookEventCompleted(eventId);
  await Promise.allSettled(notificationHandlers);

  return NextResponse.json({ received: true }, { status: 200 });
}
