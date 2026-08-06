import * as fs from "node:fs";
import * as path from "node:path";
import {
  type BillingConfig,
  type BillingConfigIssue,
  getBillingConfigIssues,
  parseBillingConfig,
} from "@commet/node";
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

  const issues = getBillingConfigIssues(moduleRecord.default);
  if (issues.length > 0) {
    throw new BillingConfigValidationError(configPath, issues);
  }

  const config = parseBillingConfig(moduleRecord.default);

  return { config, configPath };
}

export class BillingConfigValidationError extends Error {
  readonly code = "config_invalid";

  constructor(
    readonly configPath: string,
    readonly issues: BillingConfigIssue[],
  ) {
    super(
      `${configPath}: ${issues.length} invalid config field${issues.length === 1 ? "" : "s"}`,
    );
    this.name = "BillingConfigValidationError";
  }
}
