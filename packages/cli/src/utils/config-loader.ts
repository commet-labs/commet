import * as fs from "node:fs";
import * as path from "node:path";
import { createJiti } from "jiti";

const CONFIG_NAMES = [
  "commet.config.ts",
  "commet.config.js",
  "commet.config.mjs",
];

export interface LoadedConfig {
  features: Record<
    string,
    {
      name: string;
      type: "boolean" | "metered" | "seats";
      unitName?: string;
      description?: string;
    }
  >;
  plans: Record<
    string,
    {
      name: string;
      description?: string;
      consumptionModel?: "metered" | "credits" | "balance";
      isFree?: boolean;
      isPublic?: boolean;
      sortOrder?: number;
      prices: Array<{
        interval: string;
        amount: number;
        trialDays?: number;
      }>;
      features?: Record<
        string,
        | boolean
        | {
            included?: number;
            unlimited?: boolean;
            overage?: { unitPrice: number };
          }
      >;
    }
  >;
}

export function findConfigFile(cwd: string): string | null {
  for (const name of CONFIG_NAMES) {
    const fullPath = path.resolve(cwd, name);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

export async function loadBillingConfig(
  cwd: string,
): Promise<{ config: LoadedConfig; configPath: string }> {
  const configPath = findConfigFile(cwd);
  if (!configPath) {
    throw new Error(
      `No commet.config.ts found in ${cwd}. Create one with defineConfig() or run 'commet pull --config' to generate it.`,
    );
  }

  const jiti = createJiti(configPath, { interopDefault: true });
  const mod = (await jiti.import(configPath)) as Record<string, unknown>;

  if (!mod.default) {
    throw new Error(
      `${configPath}: must use \`export default defineConfig({...})\``,
    );
  }

  const config = mod.default as LoadedConfig;

  validateConfig(config, configPath);

  return { config, configPath };
}

const VALID_FEATURE_TYPES = new Set(["boolean", "metered", "seats"]);
const VALID_INTERVALS = new Set([
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "one_time",
]);

function validateConfig(config: LoadedConfig, configPath: string): void {
  if (!config || typeof config !== "object") {
    throw new Error(`${configPath}: config must be an object`);
  }

  if (!config.features || typeof config.features !== "object") {
    throw new Error(`${configPath}: config.features must be an object`);
  }

  if (!config.plans || typeof config.plans !== "object") {
    throw new Error(`${configPath}: config.plans must be an object`);
  }

  for (const [code, feature] of Object.entries(config.features)) {
    if (!feature.name || typeof feature.name !== "string") {
      throw new Error(`Feature "${code}": name is required`);
    }
    if (!VALID_FEATURE_TYPES.has(feature.type)) {
      throw new Error(
        `Feature "${code}": type must be one of: boolean, metered, seats`,
      );
    }
  }

  for (const [code, plan] of Object.entries(config.plans)) {
    if (!plan.name || typeof plan.name !== "string") {
      throw new Error(`Plan "${code}": name is required`);
    }
    if (!Array.isArray(plan.prices)) {
      throw new Error(`Plan "${code}": prices must be an array`);
    }

    for (const price of plan.prices) {
      if (!VALID_INTERVALS.has(price.interval)) {
        throw new Error(
          `Plan "${code}": price interval "${price.interval}" is not valid`,
        );
      }
      if (typeof price.amount !== "number") {
        throw new Error(`Plan "${code}": price amount must be a number`);
      }
    }

    if (plan.features) {
      for (const featureCode of Object.keys(plan.features)) {
        if (!config.features[featureCode]) {
          throw new Error(
            `Plan "${code}": references feature "${featureCode}" which is not defined in config.features`,
          );
        }
      }
    }
  }
}
