"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";

const EVENT_TYPE = "api_call";

interface ReportUsageResult {
  success: boolean;
  error?: string;
}

export async function reportUsageAction(
  properties?: Record<string, unknown>,
): Promise<ReportUsageResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await commet.usage.track({
      eventType: EVENT_TYPE,
      externalId: session.user.id,
    });

    if (!result.success) {
      return { success: false, error: result.error || "Failed to send event" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending usage event:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
