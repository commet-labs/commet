import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

function getDashboardSuccessUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3007";
  return `${baseUrl}/dashboard`;
}

type CheckoutResolution =
  | { status: "ready"; checkoutUrl: string }
  | { status: "already_subscribed" };

async function resolveCheckout(
  customerId: string,
  planCode: string,
): Promise<CheckoutResolution> {
  const existing = await commet.subscriptions.getActive({ customerId });

  if (existing.success && existing.data) {
    const status = existing.data.status;
    if (status === "active" || status === "trialing") {
      return { status: "already_subscribed" };
    }
    if (status === "pending_payment" && existing.data.checkoutUrl) {
      return { status: "ready", checkoutUrl: existing.data.checkoutUrl };
    }
  }

  const result = await commet.subscriptions.create({
    customerId,
    planCode,
    successUrl: getDashboardSuccessUrl(),
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(
      result.error?.message || "Failed to create checkout session",
    );
  }

  return { status: "ready", checkoutUrl: result.data.checkoutUrl };
}

export async function createCheckoutSession(planCode: string): Promise<never> {
  const user = await getUser();
  if (!user) {
    redirect(`/sign-up?redirect=checkout&planCode=${planCode}`);
  }

  const resolution = await resolveCheckout(user.id, planCode);
  if (resolution.status === "already_subscribed") {
    redirect("/dashboard/billing?error=already_subscribed");
  }

  redirect(resolution.checkoutUrl);
}

export async function getCheckoutUrl(planCode: string): Promise<string> {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const resolution = await resolveCheckout(user.id, planCode);
  if (resolution.status === "already_subscribed") {
    throw new Error("User already has active subscription");
  }

  return resolution.checkoutUrl;
}
