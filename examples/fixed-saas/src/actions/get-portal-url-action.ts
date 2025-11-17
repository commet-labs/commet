"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";

/**
 * Request access to the customer portal
 * Returns a secure URL for the customer to manage their billing
 */
export async function getPortalUrl(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    // Request portal access using externalId
    const result = await commet.portal.requestAccess({
      externalId: userId,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Failed to generate portal URL",
      };
    }

    console.log("result", result);
    return {
      success: true,
      url: result.data.portalUrl,
    };
  } catch (error) {
    console.error("Error requesting portal access:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
