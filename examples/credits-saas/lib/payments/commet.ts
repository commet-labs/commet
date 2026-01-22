import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function createCheckoutSession({
  planCode,
}: {
  planCode: string;
}) {
  const user = await getUser();

  if (!user) {
    redirect(`/sign-up?redirect=checkout&planCode=${planCode}`);
  }

  // With Better Auth + Commet plugin, customer is created automatically on signup
  // Create subscription via Commet
  const result = await commet.subscriptions.create({
    externalId: user.id,
    planId: planCode,
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(result.error || "Failed to create checkout session");
  }

  redirect(result.data.checkoutUrl);
}

export async function createCustomerPortalSession(userId: string) {
  const result = await commet.portal.getUrl({
    externalId: userId,
  });

  if (!result.success || !result.data?.portalUrl) {
    throw new Error(result.error || "Failed to create portal session");
  }

  return { url: result.data.portalUrl };
}
