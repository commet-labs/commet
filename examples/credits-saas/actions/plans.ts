"use server";

import { commet } from "@/lib/commet";
import type { Plan } from "@commet/node";

/**
 * Get all public plans from Commet
 */
export async function getPlansAction(): Promise<{
  success: boolean;
  data?: Plan[];
  error?: string;
}> {
  try {
    // Get public plans from Commet (returns only public plans by default)
    const result = await commet.plans.list();
    if (!result.success || !result.data) {
      return { success: false, error: "Unable to load plans. Please try again." };
    }


    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "Unable to load plans. Please try again." };
  }
}
