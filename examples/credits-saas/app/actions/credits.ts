"use server";

import { commet } from "@/lib/commet";
import { getTeamForUser } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export interface CreditsBalance {
  planCredits: number;
  purchasedCredits: number;
  totalCredits: number;
  includedCredits: number;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
}

export async function trackUsageAction(
  featureCode: string,
  value = 1,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { success: false, error: "Team not found" };
    }

    // Track credit consumption in Commet
    const result = await commet.usage.track({
      feature: featureCode,
      externalId: team.id.toString(),
      value: value,
    });

    if (!result.success) {
      return { success: false, error: result.error || "Failed to track usage" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error tracking usage:", error);
    return { success: false, error: "An error occurred while tracking usage" };
  }
}
