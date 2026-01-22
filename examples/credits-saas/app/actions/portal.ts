"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";

/**
 * Get portal URL for customer to view billing history
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

    const result = await commet.portal.getUrl({
      externalId: user.id,
    });

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
