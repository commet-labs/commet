import * as fs from "node:fs";
import * as path from "node:path";
import type { BillingConfig } from "@commet/node";
import { createJiti } from "jiti";

const CONFIG_NAMES = [
  "commet.config.ts",
  "commet.config.js",
  "commet.config.mjs",
];

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
): Promise<{ config: BillingConfig; configPath: string }> {
  const configPath = findConfigFile(cwd);
  if (!configPath) {
    throw new Error(
      `No commet.config.ts found in ${cwd}. Create one with defineConfig() or run 'commet pull' to generate it.`,
    );
  }

  const jiti = createJiti(configPath, { interopDefault: true });
  const mod: unknown = await jiti.import(configPath);

  if (!mod || typeof mod !== "object") {
    throw new Error(`${configPath}: failed to load config module`);
  }

  const moduleRecord = mod as Record<string, unknown>;
  if (!moduleRecord.default) {
    throw new Error(
      `${configPath}: must use \`export default defineConfig({...})\``,
    );
  }

  const config = moduleRecord.default as BillingConfig;

  validateConfig(config, configPath);

  return { config, configPath };
}

const VALID_FEATURE_TYPES = new Set(["boolean", "usage", "seats"]);
const VALID_INTERVALS = new Set([
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "one_time",
]);

function validateConfig(config: BillingConfig, configPath: string): void {
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
        `Feature "${code}": type must be one of: boolean, usage, seats`,
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

    if (plan.prices.length > 0) {
      if (!plan.defaultInterval) {
        throw new Error(
          `Plan "${code}": defaultInterval is required when prices are defined`,
        );
      }
      const priceIntervals = new Set(plan.prices.map((p) => p.interval));
      if (!priceIntervals.has(plan.defaultInterval)) {
        throw new Error(
          `Plan "${code}": defaultInterval "${plan.defaultInterval}" does not match any price interval (${[...priceIntervals].join(", ")})`,
        );
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
