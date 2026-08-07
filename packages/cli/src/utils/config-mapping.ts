import {
  BILLING_CONFIG_SCHEMA_VERSION,
  type BillingConfig,
  type Feature,
  type FeatureDef,
  type Plan,
  type PlanFeatureValue,
} from "@commet/node";

export function toFeatureDef(feature: Feature): FeatureDef {
  if (feature.type === "boolean") {
    return {
      name: feature.name,
      type: "boolean",
      ...(feature.description ? { description: feature.description } : {}),
    };
  }

  return {
    name: feature.name,
    type: feature.type,
    ...(feature.unitName ? { unitName: feature.unitName } : {}),
    ...(feature.description ? { description: feature.description } : {}),
  };
}

export function toPlanFeatureValue(
  planFeature: Plan["features"][number],
): PlanFeatureValue {
  const isSimpleBoolean =
    planFeature.includedAmount == null &&
    !planFeature.unlimited &&
    !planFeature.overage?.enabled;

  if (isSimpleBoolean) return planFeature.enabled;

  return {
    ...(planFeature.includedAmount != null
      ? { included: planFeature.includedAmount }
      : {}),
    ...(planFeature.unlimited ? { unlimited: true } : {}),
    ...(planFeature.overage?.enabled && planFeature.overage.unitPrice != null
      ? { overage: { unitPrice: planFeature.overage.unitPrice } }
      : {}),
  };
}

export function remoteStateToBillingConfig(
  features: Feature[],
  plans: Plan[],
): BillingConfig {
  return {
    schemaVersion: BILLING_CONFIG_SCHEMA_VERSION,
    features: Object.fromEntries(
      features.map((feature) => [feature.code, toFeatureDef(feature)]),
    ),
    plans: Object.fromEntries(
      plans.map((remotePlan) => {
        const basePrices = (remotePlan.prices ?? []).filter(
          (price) => price.inheritsFromPriceId === null,
        );
        const defaultInterval =
          basePrices.find((price) => price.isDefault)?.billingInterval ??
          basePrices[0]?.billingInterval;

        return [
          remotePlan.code,
          {
            name: remotePlan.name,
            ...(remotePlan.description
              ? { description: remotePlan.description }
              : {}),
            ...(remotePlan.consumptionModel
              ? { consumptionModel: remotePlan.consumptionModel }
              : {}),
            ...(defaultInterval ? { defaultInterval } : {}),
            ...(remotePlan.isFree ? { isFree: true } : {}),
            ...(remotePlan.isPublic === false ? { isPublic: false } : {}),
            ...(remotePlan.sortOrder !== 0
              ? { sortOrder: remotePlan.sortOrder }
              : {}),
            prices: basePrices.map((price) => ({
              interval: price.billingInterval,
              amountInCents: price.price,
              ...(price.trialDays > 0 ? { trialDays: price.trialDays } : {}),
            })),
            ...(remotePlan.features.length > 0
              ? {
                  features: Object.fromEntries(
                    remotePlan.features.map((planFeature) => [
                      planFeature.code,
                      toPlanFeatureValue(planFeature),
                    ]),
                  ),
                }
              : {}),
          },
        ];
      }),
    ),
  };
}
