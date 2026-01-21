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
      return { success: false, error: "Team not found" };
    }

    const result = await commet.portal.getUrl({
      externalId: team.id.toString(),
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Failed to get portal URL",
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
        error instanceof Error ? error.message : "Failed to get portal URL",
    };
  }
}
