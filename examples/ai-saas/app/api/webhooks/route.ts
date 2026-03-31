import { Webhooks } from "@commet/next";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
  onSubscriptionActivated: async (payload) => {
    console.log("Subscription activated:", payload.data.subscriptionId);
  },
  onSubscriptionCanceled: async (payload) => {
    console.log("Subscription canceled:", payload.data.subscriptionId);
  },
});
