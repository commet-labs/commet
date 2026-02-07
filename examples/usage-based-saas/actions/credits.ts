"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function trackUsageAction(
  featureCode: string,
  value = 1,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Please sign in to continue." };
    }

    // Track usage in Commet
    const result = await commet.usage.track({
      feature: featureCode,
      externalId: user.id,
      value: value,
    });

    if (!result.success) {
      return { success: false, error: result.error || "Unable to process usage. Please try again." };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error tracking usage:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
