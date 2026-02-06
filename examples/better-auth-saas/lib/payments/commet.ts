import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

async function ensureCommetCustomer(user: AuthUser) {
  const existing = await commet.customers.list({
    externalId: user.id,
    limit: 1,
  });

  if (existing.success && existing.data && existing.data.length > 0) {
    return existing.data[0];
  }

  if (!user.email) {
    throw new Error("User email is required to create Commet customer");
  }

  const created = await commet.customers.create({
    externalId: user.id,
    email: user.email,
    fullName: user.name ?? undefined,
  });

  if (!created.success || !created.data) {
    throw new Error(
      created.error || "Failed to create Commet customer for checkout",
    );
  }

  return created.data;
}

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

  await ensureCommetCustomer(user);

  // Check if already has active subscription
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

  // Create subscription via Commet
  let checkoutUrl: string;

  try {
    const result = await commet.subscriptions.create({
      externalId: user.id,
      planCode: planCode,
      successUrl,
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
    const errorWithDetails = error as { statusCode?: number; details?: unknown; code?: string; message?: string };

    // Handle 409 Conflict: Customer already has active subscription
    if (errorWithDetails.statusCode === 409) {
      const recheck = await commet.subscriptions.get(user.id);
      if (recheck.success && recheck.data) {
        const status = recheck.data.status;
        if (status === "active" || status === "trialing") {
          redirect("/dashboard/billing?error=already_subscribed");
        }
      }
      redirect("/dashboard/billing?error=subscription_conflict");
    }

    console.error("Failed to create checkout session:", {
      message: errorObj.message || errorWithDetails.message || String(error),
      statusCode: errorWithDetails.statusCode,
      code: errorWithDetails.code,
      externalId: user.id,
      planCode,
    });
    throw error;
  }

  // Redirect outside try-catch so NEXT_REDIRECT exception propagates correctly
  redirect(checkoutUrl);
}

/**
 * Get checkout URL without redirecting (for use in server actions called from client)
 */
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

  await ensureCommetCustomer(user);

  // Check if already has active subscription
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

  // Create subscription via Commet
  const result = await commet.subscriptions.create({
    externalId: user.id,
    planCode: planCode,
    successUrl,
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(result.error || "Failed to create checkout session");
  }

  return result.data.checkoutUrl;
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
