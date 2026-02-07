"use server";

import { unstable_cache } from "next/cache";
import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";

/**
 * Get portal URL for customer to view billing history
 *
 * This function is cached for 5 minutes per user to avoid hitting rate limits.
 * The cache key is unique per user, so each user has their own cached portal URL.
 */
export async function getPortalUrlAction(): Promise<{
  success: boolean;
  portalUrl?: string;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Please sign in to continue." };
    }

    const subscriptionResult = await commet.subscriptions.get(user.id);
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: false, error: "No active subscription." };
    }

    const subscription = subscriptionResult.data;
    if (subscription.status !== "active" && subscription.status !== "trialing") {
      return { success: false, error: "No active subscription." };
    }

    const getCachedPortalUrl = unstable_cache(
      async (userId: string) => {
        try {
          const result = await commet.portal.getUrl({
            externalId: userId,
          });
          return result;
        } catch (error) {
          // If rate limited or any error, return graceful failure
          console.warn("Portal URL fetch failed (will retry after cache expires):", error);
          return { success: false, error: "Rate limited", data: null };
        }
      },
      [`portal-url-${user.id}`],
      {
        revalidate: 300, // Cache for 5 minutes
        tags: [`portal-${user.id}`],
      }
    );

    const result = await getCachedPortalUrl(user.id);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Unable to access billing portal. Please try again.",
      };
    }

    return {
      success: true,
      portalUrl: result.data.portalUrl,
    };
  } catch (error) {
    console.error("Error getting portal URL:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unable to access billing portal. Please try again.",
    };
  }
}
