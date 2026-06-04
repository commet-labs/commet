"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { getCheckoutUrl } from "@/lib/checkout";

export async function checkoutAction(formData: FormData) {
  const planCode = formData.get("planCode") as string;
  const user = await getUser();
  if (!user) {
    redirect(`/sign-up?planCode=${planCode}`);
  }

  redirect(`/checkout?planCode=${planCode}`);
}

export async function handlePostSignupCheckout(planCode: string) {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" } as const;
  }

  try {
    const checkoutUrl = await getCheckoutUrl(planCode);
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
