"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { getCheckoutUrl } from "@/lib/payments/commet";
import { normalizePlanCode } from "@/lib/plans";
import { buildInternalHref } from "@/lib/redirects";

export async function checkoutAction(formData: FormData) {
  const planCode = normalizePlanCode(formData.get("planCode"));
  if (!planCode) {
    redirect("/pricing?error=missing_plan");
  }

  const user = await getUser();
  if (!user) {
    redirect(buildInternalHref("/sign-up", { planCode }));
  }

  redirect(buildInternalHref("/checkout", { planCode }));
}

export async function handlePostSignupCheckout(planCode: string) {
  "use server";

  const user = await getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" } as const;
  }

  const successUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`;

  try {
    const checkoutUrl = await getCheckoutUrl({ planCode, successUrl });
    return { success: true, checkoutUrl } as const;
  } catch (error) {
    console.error("Failed to get checkout URL:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.",
    } as const;
  }
}

export async function customerPortalAction() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { commet } = await import("@/lib/commet");
  const portalResult = await commet.portal.getUrl({ customerId: user.id });

  if (!portalResult.success || !portalResult.data?.portalUrl) {
    redirect("/dashboard/billing");
  }

  redirect(portalResult.data.portalUrl);
}
