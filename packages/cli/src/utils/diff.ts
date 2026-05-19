import chalk from "chalk";
import type { LoadedConfig } from "./config-loader";

export interface RemoteFeature {
  code: string;
  name: string;
  type: string;
  description?: string | null;
  unitName?: string | null;
}

export interface RemotePlanPrice {
  billingInterval: string;
  price: number;
  trialDays?: number | null;
  isDefault?: boolean;
}

export interface RemotePlanFeature {
  featureCode: string;
  enabled?: boolean | null;
  includedAmount?: number | null;
  unlimited?: boolean | null;
  overageEnabled?: boolean | null;
  overageUnitPrice?: number | null;
}

export interface RemotePlan {
  code: string;
  name: string;
  description?: string | null;
  consumptionModel?: string | null;
  defaultInterval?: string | null;
  isFree?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  prices: RemotePlanPrice[];
  features: RemotePlanFeature[];
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
  config: LoadedConfig,
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
    if (
      "unitName" in localFeature &&
      (remoteFeature.unitName ?? undefined) !== localFeature.unitName
    ) {
      changes.push(
        `unitName: "${remoteFeature.unitName ?? ""}" → "${localFeature.unitName}"`,
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

    const remoteDefaultInterval =
      remotePlan.defaultInterval ??
      remotePlan.prices.find((p) => p.isDefault)?.billingInterval ??
      null;
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
      remotePlan.prices.map((p) => [p.billingInterval, p]),
    );

    for (const [interval, localPrice] of localPriceMap) {
      const remotePrice = remotePriceMap.get(interval);
      if (!remotePrice) {
        changes.push(
          `price ${interval}: new ($${(localPrice.amount / 10000).toFixed(2)})`,
        );
      } else if (remotePrice.price !== localPrice.amount) {
        changes.push(
          `price ${interval}: $${(remotePrice.price / 10000).toFixed(2)} → $${(localPrice.amount / 10000).toFixed(2)}`,
        );
      }
    }

    if (localPlan.features) {
      const remotePlanFeatureMap = new Map(
        remotePlan.features.map((f) => [f.featureCode, f]),
      );
      for (const featureCode of Object.keys(localPlan.features)) {
        if (!remotePlanFeatureMap.has(featureCode)) {
          changes.push(`feature ${featureCode}: new`);
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
