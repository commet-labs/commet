"use server";

import { commet } from "@/lib/commet";
import { getTeamForUser } from "@/lib/db/queries";

/**
 * Get portal URL for customer to view billing history
 */
export async function getPortalUrlAction(): Promise<{
  success: boolean;
  portalUrl?: string;
  error?: string;
}> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { success: false, error: "We couldn't find your workspace." };
    }

    const result = await commet.portal.getUrl({
      externalId: team.id.toString(),
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
