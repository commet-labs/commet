"use server";

import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getCheckoutUrl } from "@/lib/payments/commet";

export async function checkoutAction(formData: FormData) {
  const planCode = formData.get("planCode") as string;
  const user = await getUser();
  if (!user) {
    redirect(`/sign-up?planCode=${planCode}`);
  }

  redirect(`/checkout?planCode=${planCode}`);
}

/**
 * Server action to handle checkout after signup
 * Redirects directly to Stripe checkout (ensures session cookies are available)
 */
export async function handlePostSignupCheckout(planCode: string) {
  "use server";
  
  const user = await getUser();
  
  if (!user) {
    return { success: false, error: "User not authenticated" } as const;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || "http://localhost:3000";
  const successUrl = `${baseUrl}/dashboard`;
  
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

  redirect("/dashboard/billing");
}
