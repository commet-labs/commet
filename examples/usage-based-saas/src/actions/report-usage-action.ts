"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";

const EVENT_TYPE = "storage";

interface ReportUsageResult {
  success: boolean;
  error?: string;
}

export async function reportUsageAction(
  count = 1,
): Promise<ReportUsageResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Ensure count is at least 1
    const eventCount = Math.max(1, Math.floor(count));

    if (eventCount === 1) {
      // Use track() for single event
      const result = await commet.usage.track({
        eventType: EVENT_TYPE,
        externalId: session.user.id,
      });

      if (!result.success) {
        return { success: false, error: result.error || "Failed to send event" };
      }

      return { success: true };
    }
    
    // Use trackBatch() for multiple events
    const events = Array.from({ length: eventCount }, (_, index) => ({
      externalId: session.user.id,
      eventType: EVENT_TYPE,
      idempotencyKey: `batch_${Date.now()}_${index}`,
    }));

    const result = await commet.usage.trackBatch({
      events,
    });

    if (!result.success) {
      return { success: false, error: result.error || "Failed to send events" };
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
