"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";

export interface UsageData {
  current: number;
  included: number;
  remaining: number;
  overage: number;
  allowed: boolean;
  unlimited: boolean;
}

interface GetUsageResult {
  success: boolean;
  data?: UsageData;
  error?: string;
}

export async function getUsageAction(): Promise<GetUsageResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await commet.features.get("api_calls", session.user.id);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.message || "Failed to get usage data",
      };
    }

    return {
      success: true,
      data: {
        current: result.data.current ?? 0,
        included: result.data.included ?? 0,
        remaining: result.data.remaining ?? 0,
        overage: result.data.overage ?? 0,
        allowed: result.data.allowed,
        unlimited: result.data.unlimited ?? false,
      },
    };
  } catch (error) {
    console.error("Error getting usage:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
