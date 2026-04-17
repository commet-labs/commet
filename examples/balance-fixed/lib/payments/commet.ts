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

  const existing = await commet.subscriptions.get(user.id);

  if (existing.success && existing.data) {
    const status = existing.data.status;

    if (status === "active" || status === "trialing") {
      redirect("/dashboard/billing?error=already_subscribed");
    }

    if (status === "pending_payment" && existing.data.checkoutUrl) {
      redirect(existing.data.checkoutUrl);
    }
  }

  const result = await commet.subscriptions.create({
    customerId: user.id,
    planCode,
    successUrl,
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(result.message || "Failed to create checkout session");
  }

  redirect(result.data.checkoutUrl);
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

  const existing = await commet.subscriptions.get(user.id);

  if (existing.success && existing.data) {
    const status = existing.data.status;

    if (status === "active" || status === "trialing") {
      throw new Error("User already has active subscription");
    }

    if (status === "pending_payment" && existing.data.checkoutUrl) {
      return existing.data.checkoutUrl;
    }
  }

  const result = await commet.subscriptions.create({
    customerId: user.id,
    planCode,
    successUrl,
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(result.message || "Failed to create checkout session");
  }

  return result.data.checkoutUrl;
}
