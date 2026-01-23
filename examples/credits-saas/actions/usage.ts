"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";

export interface FeatureUsage {
  code: string;
  name: string;
  current: number;
  included: number;
  remaining: number;
  unit: string;
}

export interface UsageData {
  features: FeatureUsage[];
  hasSubscription: boolean;
}

/**
 * Get usage data from Commet SDK for all features
 * Returns usage information formatted for UsageMeter components
 */
export async function getUsageDataAction(): Promise<{
  success: boolean;
  data?: UsageData;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Please sign in to continue." };
    }

    const externalId = user.id;

    // Check if customer has an active subscription
    const subscriptionResult = await commet.subscriptions.get(externalId);

    if (!subscriptionResult.success || !subscriptionResult.data) {
      return {
        success: true,
        data: {
          features: [],
          hasSubscription: false,
        },
      };
    }

    // Get all features from the subscription
    const subscription = subscriptionResult.data;
    if (subscription.status !== "active" && subscription.status !== "trialing") {
      return {
        success: true,
        data: {
          features: [],
          hasSubscription: false,
        },
      };
    }
    const features: FeatureUsage[] = [];

    // Fetch usage data for each feature in the subscription
    // Only include metered or credits features that have usage data
    for (const featureSummary of subscription.features) {
      // Skip boolean features as they don't have usage meters
      if (featureSummary.type === "boolean") {
        continue;
      }

      const featureResult = await commet.features.get({
        code: featureSummary.code,
        externalId,
      });

      if (featureResult.success && featureResult.data) {
        const feature = featureResult.data;

        // Only include features that have usage data (metered or credits)
        if (feature.current !== undefined && feature.included !== undefined) {
          // Determine unit based on feature name/code
          let unit = "units";
          if (feature.code.includes("generation") || feature.code.includes("image")) {
            unit = "images";
          } else if (feature.code.includes("api") || feature.code.includes("request")) {
            unit = "reqs";
          }

          features.push({
            code: feature.code,
            name: feature.name,
            current: feature.current ?? 0,
            included: feature.included ?? 0,
            remaining: feature.remaining ?? 0,
            unit,
          });
        }
      }
    }

    return {
      success: true,
      data: {
        features,
        hasSubscription: true,
      },
    };
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unable to load usage data. Please try again.",
    };
  }
}
