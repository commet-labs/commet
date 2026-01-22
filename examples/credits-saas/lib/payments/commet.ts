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

  // Check if already has active subscription
  const existing = await commet.subscriptions.get(user.id);

  if (existing.data) {
    if (
      existing.data.status === "active" ||
      existing.data.status === "trialing"
    ) {
      // User already has an active subscription, redirect to dashboard
      redirect("/dashboard/billing");
    }

    if (existing.data.status === "pending_payment" && existing.data.checkoutUrl) {
      // User has a pending checkout session, redirect to it
      redirect(existing.data.checkoutUrl);
    }
  }

  // With Better Auth + Commet plugin, customer is created automatically on signup
  // Create subscription via Commet
  let checkoutUrl: string;
  
  try {
    const result = await commet.subscriptions.create({
      externalId: user.id,
      planCode: planCode,
    });

    if (!result.success || !result.data?.checkoutUrl) {
      console.error("Failed to create checkout session:", {
        error: result.error,
        details: "details" in result ? result.details : undefined,
        externalId: user.id,
        planId: planCode,
      });
      throw new Error(result.error || "Failed to create checkout session");
    }

    checkoutUrl = result.data.checkoutUrl;
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorWithDetails = error as { statusCode?: number; details?: unknown; code?: string };
    
    // Handle 409 Conflict: Customer already has active subscription
    if (errorWithDetails.statusCode === 409) {
      redirect("/dashboard/billing?error=already_subscribed");
    }
    
    console.error("Exception creating checkout session:", {
      message: errorObj.message,
      statusCode: errorWithDetails.statusCode,
      details: errorWithDetails.details,
      code: errorWithDetails.code,
      externalId: user.id,
      planId: planCode,
    });
    throw error;
  }

  // Redirect outside try-catch so NEXT_REDIRECT exception propagates correctly
  redirect(checkoutUrl);
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
