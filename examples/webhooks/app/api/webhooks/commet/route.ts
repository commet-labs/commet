import { Webhooks } from "@commet/next";
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

  const handleCommetWebhook = Webhooks({
    webhookSecret,

    onPayload: recordWebhookEvent,

    onCustomerStateChanged: async (payload) => {
      await syncBillingStateFromSnapshot(payload.data);
      if (payload.data.trigger === "subscription_activated") {
        const activatedUser = await resolveActivatedUserForWelcome(
          payload.data,
        );
        await Promise.all([
          sendWelcomeEmail(activatedUser),
          notifyTeamOfNewSubscription(activatedUser),
        ]);
      }
    },

    onSubscriptionActivated: async (payload) => {
      await recordCurrentPeriod(payload.data);
    },

    onPaymentReceived: async (payload) => {
      await restoreAccessAfterPayment(payload.data);
    },

    onPaymentRecovered: async (payload) => {
      await restoreAccessAfterPayment(payload.data);
    },

    onUsageRecorded: async (payload) => {
      await recordUsageFromEvent(payload.data);
    },

    onError: async (error, payload) => {
      console.error("[commet-webhook] handler failed", { error, payload });
    },
  });

  return handleCommetWebhook(request);
}
