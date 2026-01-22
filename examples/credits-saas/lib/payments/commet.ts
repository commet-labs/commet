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
  try {
    const result = await commet.subscriptions.create({
      externalId: user.id,
      planCode: planCode,
    });

    if (!result.success || !result.data?.checkoutUrl) {
      console.error("Failed to create checkout session:", {
        error: result.error,
        details: (result as any).details,
        externalId: user.id,
        planId: planCode,
      });
      throw new Error(result.error || "Failed to create checkout session");
    }

    redirect(result.data.checkoutUrl);
  } catch (error: any) {
    console.error("Exception creating checkout session:", {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      code: error.code,
      externalId: user.id,
      planId: planCode,
    });
    throw error;
  }
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
