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
 * Returns usage information formatted for usage-meter components
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
    // Fetch usage data for each feature in the subscription in parallel
    // Only include metered or credits features that have usage data
    const featurePromises = subscription.features
      .filter((featureSummary) => featureSummary.type !== "boolean")
      .map(async (featureSummary) => {
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

            return {
              code: feature.code,
              name: feature.name,
              current: feature.current ?? 0,
              included: feature.included ?? 0,
              remaining: feature.remaining ?? 0,
              unit,
            } as FeatureUsage;
          }
        }
        return null;
      });

    const featureResults = await Promise.all(featurePromises);
    const features = featureResults.filter((f): f is FeatureUsage => f !== null);

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
