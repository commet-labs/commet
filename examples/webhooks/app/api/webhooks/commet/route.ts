import { type WebhookPayload, Webhooks } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";
import {
  recordCurrentPeriod,
  recordUsageFromEvent,
  resolveActivatedUserForWelcome,
  restoreAccessAfterPayment,
  syncBillingStateFromSnapshot,
} from "@/lib/billing/sync";
import { recordWebhookEvent } from "@/lib/billing/webhook-events";
import { sendWelcomeEmail } from "@/lib/notifications/email";
import { notifyTeamOfNewSubscription } from "@/lib/notifications/team";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.COMMET_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { received: false, error: "COMMET_WEBHOOK_SECRET is not set" },
      { status: 500 },
    );
  }

  const webhooks = new Webhooks();
  const rawBody = await request.text();
  const signature = request.headers.get("x-commet-signature");

  const isValid = webhooks.verify({
    payload: rawBody,
    signature,
    secret: webhookSecret,
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

  const handlers: Promise<void>[] = [recordWebhookEvent(payload)];

  switch (payload.event) {
    case "customer.state_changed":
      handlers.push(
        syncBillingStateFromSnapshot(payload.data).then(async () => {
          if (payload.data.trigger !== "subscription_activated") {
            return;
          }

          const activatedUser = await resolveActivatedUserForWelcome(
            payload.data,
          );
          await Promise.all([
            sendWelcomeEmail(activatedUser),
            notifyTeamOfNewSubscription(activatedUser),
          ]);
        }),
      );
      break;

    case "subscription.activated":
    case "subscription.reactivated":
      handlers.push(recordCurrentPeriod(payload.data));
      break;

    case "payment.received":
    case "payment.recovered":
      handlers.push(restoreAccessAfterPayment(payload.data));
      break;

    case "usage.recorded":
      handlers.push(recordUsageFromEvent(payload.data));
      break;
  }

  try {
    await Promise.all(handlers);
  } catch (error) {
    console.error("[commet-webhook] handler failed", { error, payload });
    return NextResponse.json(
      { received: true, warning: "Handler failed" },
      { status: 200 },
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
