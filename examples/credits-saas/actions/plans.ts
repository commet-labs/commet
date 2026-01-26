"use server";

import { commet } from "@/lib/commet";
import type { Plan } from "@commet/node";
import { unstable_cache } from "next/cache";

/**
 * Cached function to fetch plans from Commet
 * Revalidates every hour or on-demand with the "plans" tag
 */
const getCachedPlans = unstable_cache(
  async () => {
    const result = await commet.plans.list();
    if (!result.success || !result.data) {
      throw new Error("Unable to load plans");
    }
    return result.data;
  },
  ["plans"],
  { revalidate: 3600, tags: ["plans"] }
);

/**
 * Get all public plans from Commet
 */
export async function getPlansAction(): Promise<{
  success: boolean;
  data?: Plan[];
  error?: string;
}> {
  try {
    const plans = await getCachedPlans();
    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "Unable to load plans. Please try again." };
  }
}
