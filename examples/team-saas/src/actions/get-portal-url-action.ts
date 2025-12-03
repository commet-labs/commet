"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";

export async function getPortalUrl(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Use customer-scoped API
    const result = await commet.customer(session.user.id).portal.getUrl();

    if (!result.success || !result.data) {
      return { success: false, error: "Failed to generate portal URL" };
    }

    return { success: true, url: result.data.portalUrl };
  } catch (error) {
    console.error("Error requesting portal access:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
