import type { BillingConfig, Feature, Plan } from "@commet/node";
import chalk from "chalk";

type SdkPlanPrice = NonNullable<Plan["prices"]>[number];
type SdkPlanFeature = NonNullable<Plan["features"]>[number];

type RemoteFeature = Pick<
  Feature,
  "code" | "name" | "type" | "unitName" | "description"
>;
type RemotePlanPrice = Pick<
  SdkPlanPrice,
  "billingInterval" | "price" | "isDefault" | "trialDays"
>;
interface RemotePlanFeature
  extends Pick<
    SdkPlanFeature,
    "code" | "enabled" | "includedAmount" | "unlimited"
  > {
  overage: { enabled: boolean; unitPrice: number | null } | null;
}

function formatUsdCents(amountInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

interface RemotePlan {
  code: string;
  name: string;
  description: string | null;
  consumptionModel: Plan["consumptionModel"];
  isFree: boolean;
  isPublic: boolean;
  sortOrder: number;
  prices?: RemotePlanPrice[];
  features?: RemotePlanFeature[];
}

export interface RemoteState {
  features: RemoteFeature[];
  plans: RemotePlan[];
}

interface FeatureChange {
  code: string;
  action: "create" | "update" | "unchanged";
  changes?: string[];
}

interface PlanChange {
  code: string;
  action: "create" | "update" | "unchanged";
  changes?: string[];
}

export interface ConfigDiff {
  features: {
    changes: FeatureChange[];
    unmanaged: string[];
  };
  plans: {
    changes: PlanChange[];
    unmanaged: string[];
  };
  hasChanges: boolean;
}

export function computeDiff(
  config: BillingConfig,
  remote: RemoteState,
): ConfigDiff {
  const remoteFeatureMap = new Map(remote.features.map((f) => [f.code, f]));
  const remotePlanMap = new Map(remote.plans.map((p) => [p.code, p]));

  const featureChanges: FeatureChange[] = [];
  for (const [code, localFeature] of Object.entries(config.features)) {
    const remoteFeature = remoteFeatureMap.get(code);
    if (!remoteFeature) {
      featureChanges.push({ code, action: "create" });
      continue;
    }

    const changes: string[] = [];
    if (remoteFeature.name !== localFeature.name) {
      changes.push(`name: "${remoteFeature.name}" → "${localFeature.name}"`);
    }
    if (remoteFeature.type !== localFeature.type) {
      changes.push(
        `type: "${remoteFeature.type}" → "${localFeature.type}" (BLOCKED)`,
      );
    }
    const localUnitName =
      "unitName" in localFeature ? (localFeature.unitName ?? null) : null;
    if ((remoteFeature.unitName ?? null) !== localUnitName) {
      changes.push(
        `unitName: "${remoteFeature.unitName ?? ""}" → "${localUnitName ?? ""}"`,
      );
    }
    if ((remoteFeature.description ?? undefined) !== localFeature.description) {
      changes.push(
        `description: "${remoteFeature.description ?? ""}" → "${localFeature.description ?? ""}"`,
      );
    }

    featureChanges.push(
      changes.length > 0
        ? { code, action: "update", changes }
        : { code, action: "unchanged" },
    );
  }

  const unmanagedFeatures = remote.features
    .filter((f) => !config.features[f.code])
    .map((f) => f.code);

  const planChanges: PlanChange[] = [];
  for (const [code, localPlan] of Object.entries(config.plans)) {
    const remotePlan = remotePlanMap.get(code);
    if (!remotePlan) {
      planChanges.push({ code, action: "create" });
      continue;
    }

    const changes: string[] = [];
    if (remotePlan.name !== localPlan.name) {
      changes.push(`name: "${remotePlan.name}" → "${localPlan.name}"`);
    }
    if ((remotePlan.description ?? undefined) !== localPlan.description) {
      changes.push(
        `description: "${remotePlan.description ?? ""}" → "${localPlan.description ?? ""}"`,
      );
    }
    if (remotePlan.consumptionModel !== (localPlan.consumptionModel ?? null)) {
      changes.push(
        `consumptionModel: "${remotePlan.consumptionModel ?? "none"}" → "${localPlan.consumptionModel ?? "none"}"`,
      );
    }
    if (remotePlan.isFree !== (localPlan.isFree ?? false)) {
      changes.push(
        `isFree: ${remotePlan.isFree} → ${localPlan.isFree ?? false}`,
      );
    }
    if (remotePlan.isPublic !== (localPlan.isPublic ?? true)) {
      changes.push(
        `isPublic: ${remotePlan.isPublic} → ${localPlan.isPublic ?? true}`,
      );
    }
    if (remotePlan.sortOrder !== (localPlan.sortOrder ?? 0)) {
      changes.push(
        `sortOrder: ${remotePlan.sortOrder} → ${localPlan.sortOrder ?? 0}`,
      );
    }

    const remotePrices = remotePlan.prices ?? [];
    const remoteDefaultInterval =
      remotePrices.find((p) => p.isDefault)?.billingInterval ?? null;
    if (
      localPlan.defaultInterval &&
      remoteDefaultInterval !== localPlan.defaultInterval
    ) {
      changes.push(
        `defaultInterval: "${remoteDefaultInterval ?? "none"}" → "${localPlan.defaultInterval}"`,
      );
    }

    const localPriceMap = new Map(localPlan.prices.map((p) => [p.interval, p]));
    const remotePriceMap = new Map(
      remotePrices.map((p) => [p.billingInterval, p]),
    );

    for (const [interval, localPrice] of localPriceMap) {
      const remotePrice = remotePriceMap.get(interval);
      if (!remotePrice) {
        changes.push(
          `price ${interval}: new (${formatUsdCents(localPrice.amountInCents)})`,
        );
      } else if (remotePrice.price !== localPrice.amountInCents) {
        changes.push(
          `price ${interval}: ${formatUsdCents(remotePrice.price)} → ${formatUsdCents(localPrice.amountInCents)}`,
        );
      }
      if (
        remotePrice &&
        remotePrice.trialDays !== (localPrice.trialDays ?? 0)
      ) {
        changes.push(
          `price ${interval} trialDays: ${remotePrice.trialDays} → ${localPrice.trialDays ?? 0}`,
        );
      }
    }

    if (localPlan.features) {
      const remotePlanFeatureMap = new Map(
        (remotePlan.features ?? []).map((f) => [f.code, f]),
      );
      for (const featureCode of Object.keys(localPlan.features)) {
        const remotePlanFeature = remotePlanFeatureMap.get(featureCode);
        if (!remotePlanFeature) {
          changes.push(`feature ${featureCode}: new`);
          continue;
        }

        const localFeatureValue = localPlan.features[featureCode];
        if (localFeatureValue === undefined) continue;
        const localFeatureState =
          typeof localFeatureValue === "boolean"
            ? {
                enabled: localFeatureValue,
                includedAmount: 0,
                unlimited: false,
                overageEnabled: false,
                overageUnitPrice: 0,
              }
            : {
                enabled: true,
                includedAmount: localFeatureValue.included ?? 0,
                unlimited: localFeatureValue.unlimited ?? false,
                overageEnabled: localFeatureValue.overage !== undefined,
                overageUnitPrice: localFeatureValue.overage?.unitPrice ?? 0,
              };
        const remoteFeatureState = {
          enabled: remotePlanFeature.enabled,
          includedAmount: remotePlanFeature.includedAmount ?? 0,
          unlimited: remotePlanFeature.unlimited,
          overageEnabled: remotePlanFeature.overage?.enabled ?? false,
          overageUnitPrice: remotePlanFeature.overage?.unitPrice ?? 0,
        };
        if (
          JSON.stringify(remoteFeatureState) !==
          JSON.stringify(localFeatureState)
        ) {
          changes.push(`feature ${featureCode}: configuration changed`);
        }
      }
    }

    planChanges.push(
      changes.length > 0
        ? { code, action: "update", changes }
        : { code, action: "unchanged" },
    );
  }

  const unmanagedPlans = remote.plans
    .filter((p) => !config.plans[p.code])
    .map((p) => p.code);

  const hasChanges =
    featureChanges.some((c) => c.action !== "unchanged") ||
    planChanges.some((c) => c.action !== "unchanged");

  return {
    features: { changes: featureChanges, unmanaged: unmanagedFeatures },
    plans: { changes: planChanges, unmanaged: unmanagedPlans },
    hasChanges,
  };
}

export function formatDiff(diff: ConfigDiff): string {
  const lines: string[] = [];

  lines.push(chalk.bold("\nFeatures:"));
  for (const change of diff.features.changes) {
    if (change.action === "create") {
      lines.push(chalk.green(`  + ${change.code}`));
    } else if (change.action === "update") {
      lines.push(chalk.yellow(`  ~ ${change.code}`));
      for (const c of change.changes ?? []) {
        lines.push(chalk.dim(`      ${c}`));
      }
    } else {
      lines.push(chalk.dim(`    ${change.code}`));
    }
  }
  if (diff.features.unmanaged.length > 0) {
    lines.push(
      chalk.dim(
        `  ? unmanaged: ${diff.features.unmanaged.join(", ")} (not in config, left as-is)`,
      ),
    );
  }

  lines.push(chalk.bold("\nPlans:"));
  for (const change of diff.plans.changes) {
    if (change.action === "create") {
      lines.push(chalk.green(`  + ${change.code}`));
    } else if (change.action === "update") {
      lines.push(chalk.yellow(`  ~ ${change.code}`));
      for (const c of change.changes ?? []) {
        lines.push(chalk.dim(`      ${c}`));
      }
    } else {
      lines.push(chalk.dim(`    ${change.code}`));
    }
  }
  if (diff.plans.unmanaged.length > 0) {
    lines.push(
      chalk.dim(
        `  ? unmanaged: ${diff.plans.unmanaged.join(", ")} (not in config, left as-is)`,
      ),
    );
  }

  return lines.join("\n");
}
