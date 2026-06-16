import { Webhooks } from "@commet/next";
import { type NextRequest, NextResponse } from "next/server";
import {
  activateSubscriptionForUser,
  applyPlanChangeForUser,
  clearPastDueForUser,
  deactivateSubscriptionForUser,
  markPaymentFailedForUser,
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

    onSubscriptionActivated: async (payload) => {
      const activatedUser = await activateSubscriptionForUser(payload.data);
      await Promise.all([
        sendWelcomeEmail(activatedUser),
        notifyTeamOfNewSubscription(activatedUser),
      ]);
    },

    onSubscriptionCanceled: async (payload) => {
      await deactivateSubscriptionForUser(payload.data);
    },

    onSubscriptionPlanChanged: async (payload) => {
      await applyPlanChangeForUser(payload.data);
    },

    onPaymentFailed: async (payload) => {
      await markPaymentFailedForUser(payload.data);
    },

    onPaymentReceived: async (payload) => {
      await clearPastDueForUser(payload.data);
    },

    onError: async (error, payload) => {
      console.error("[commet-webhook] handler failed", { error, payload });
    },
  });

  return handleCommetWebhook(request);
}
