import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

export async function createCheckoutSession({
  planCode,
  successUrl,
}: {
  planCode: string;
  successUrl?: string;
}) {
  const user = await getUser();

  if (!user) {
    redirect(`/sign-up?redirect=checkout&planCode=${planCode}`);
  }

  const existing = await commet.subscriptions.getActive({
    customerId: user.id,
  });

  if (existing) {
    const status = existing.status;

    if (status === "active" || status === "trialing") {
      redirect("/dashboard/billing?error=already_subscribed");
    }

    if (status === "pending_payment" && existing.checkoutUrl) {
      redirect(existing.checkoutUrl);
    }
  }

  const result = await commet.subscriptions.create({
    customerId: user.id,
    planCode,
    successUrl,
  });

  if (!result.checkoutUrl) {
    throw new Error("Failed to create checkout session");
  }

  redirect(result.checkoutUrl);
}

export async function getCheckoutUrl({
  planCode,
  successUrl,
}: {
  planCode: string;
  successUrl?: string;
}): Promise<string> {
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const existing = await commet.subscriptions.getActive({
    customerId: user.id,
  });

  if (existing) {
    const status = existing.status;

    if (status === "active" || status === "trialing") {
      throw new Error("User already has active subscription");
    }

    if (status === "pending_payment" && existing.checkoutUrl) {
      return existing.checkoutUrl;
    }
  }

  const result = await commet.subscriptions.create({
    customerId: user.id,
    planCode,
    successUrl,
  });

  if (!result.checkoutUrl) {
    throw new Error("Failed to create checkout session");
  }

  return result.checkoutUrl;
}
