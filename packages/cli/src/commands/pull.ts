import * as fs from "node:fs";
import * as path from "node:path";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  findConfigFile,
  type LoadedConfig,
  loadBillingConfig,
} from "../utils/config-loader";
import { computeDiff, formatDiff, type RemoteState } from "../utils/diff";
import { generateConfigFile } from "../utils/generator";
import { isAgentMode, requireOrgContext } from "../utils/output";

interface Feature {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string | null;
  type: "boolean" | "usage" | "seats";
  unitName?: string | null;
}

interface Plan {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string | null;
  consumptionModel?: "metered" | "credits" | "balance" | null;
  isFree?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  prices?: Array<{
    billingInterval: string;
    price: number;
    trialDays?: number | null;
    isDefault?: boolean;
  }>;
  features?: Array<{
    featureCode: string;
    enabled?: boolean | null;
    includedAmount?: number | null;
    unlimited?: boolean | null;
    overageEnabled?: boolean | null;
    overageUnitPrice?: number | null;
  }>;
}

interface ConfigResponse {
  success: boolean;
  features: Feature[];
  plans: Plan[];
}

interface PullOptions {
  yes?: boolean;
  dryRun?: boolean;
  output?: string;
}

export const pullCommand = new Command("pull")
  .description(
    "Fetch your billing config from Commet and generate (or update) commet.config.ts with features and plans.",
  )
  .option("-y, --yes", "Skip confirmation prompt")
  .option("--dry-run", "Show what would change without writing any files")
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet pull                  Interactive — shows diff, asks to confirm
  $ commet pull --dry-run        Preview changes without applying
  $ commet pull --yes            Apply without confirmation
  $ commet pull --output agent --yes   Agent/CI — structured JSON, no prompts
  $ COMMET_API_KEY=sk_... commet pull --yes   CI pipeline
`,
  )
  .action(async (options: PullOptions) => {
    const agentMode = isAgentMode(options);
    const { orgId } = requireOrgContext();

    const spinner = agentMode
      ? null
      : ora("Fetching config from remote...").start();

    const orgQuery = orgId === "__from_api_key__" ? "" : `?orgId=${orgId}`;
    const result = await apiRequest<ConfigResponse>(
      `${BASE_URL}/api/cli/pull${orgQuery}`,
    );

    if (result.error || !result.data) {
      if (agentMode) {
        console.log(JSON.stringify({ error: result.error }));
      } else {
        spinner?.fail("Failed to fetch config");
        console.error(chalk.red("Error:"), result.error?.message);
      }
      process.exit(1);
    }

    spinner?.succeed("Remote state fetched");

    const { features, plans } = result.data;
    const configContent = generateConfigFile(features, plans);
    const outputPath = path.resolve(process.cwd(), "commet.config.ts");

    const existingConfigPath = findConfigFile(process.cwd());

    if (!existingConfigPath) {
      if (options.dryRun) {
        if (agentMode) {
          console.log(
            JSON.stringify({
              action: "create",
              features: features.length,
              plans: plans.length,
              applied: false,
            }),
          );
        } else {
          console.log(
            chalk.green(
              `\nWould create commet.config.ts (${features.length} features, ${plans.length} plans)`,
            ),
          );
        }
        return;
      }

      fs.writeFileSync(outputPath, configContent, "utf8");

      if (agentMode) {
        console.log(
          JSON.stringify({
            action: "create",
            features: features.length,
            plans: plans.length,
            applied: true,
          }),
        );
      } else {
        console.log(chalk.green("\n✓ Created commet.config.ts"));
        console.log(
          chalk.dim(`  ${features.length} features, ${plans.length} plans`),
        );
      }
      return;
    }

    const localLoaded = await loadBillingConfig(process.cwd()).catch(
      (error: unknown) => ({
        parseError: error instanceof Error ? error.message : String(error),
      }),
    );

    if ("parseError" in localLoaded) {
      if (options.dryRun) {
        if (agentMode) {
          console.log(
            JSON.stringify({
              action: "overwrite",
              reason: localLoaded.parseError,
              applied: false,
            }),
          );
        } else {
          console.log(
            chalk.yellow(
              `\n⚠ Local config is invalid: ${localLoaded.parseError}`,
            ),
          );
        }
        return;
      }

      if (!options.yes && !agentMode) {
        console.log(chalk.yellow(`\n⚠ ${localLoaded.parseError}`));
        const shouldProceed = await confirm({
          message: "Overwrite with remote?",
          default: true,
        });
        if (!shouldProceed) {
          console.log(chalk.dim("Pull cancelled"));
          return;
        }
      }

      fs.writeFileSync(outputPath, configContent, "utf8");
      if (agentMode) {
        console.log(JSON.stringify({ action: "overwrite", applied: true }));
      } else {
        console.log(chalk.green("\n✓ Overwritten commet.config.ts"));
      }
      return;
    }

    const localConfig = localLoaded.config;

    const remoteAsConfig: LoadedConfig = {
      features: Object.fromEntries(
        features.map((f) => [
          f.code,
          {
            name: f.name,
            type: f.type,
            ...(f.unitName ? { unitName: f.unitName } : {}),
            ...(f.description ? { description: f.description } : {}),
          },
        ]),
      ),
      plans: Object.fromEntries(
        plans.map((p) => [
          p.code,
          {
            name: p.name,
            ...(p.description ? { description: p.description } : {}),
            ...(p.consumptionModel
              ? { consumptionModel: p.consumptionModel }
              : {}),
            ...(p.isFree ? { isFree: true } : {}),
            ...(p.isPublic === false ? { isPublic: false } : {}),
            ...(p.sortOrder ? { sortOrder: p.sortOrder } : {}),
            ...(() => {
              const planPrices = p.prices ?? [];
              const defaultPrice = planPrices.find((pr) => pr.isDefault);
              const defaultInterval =
                defaultPrice?.billingInterval ?? planPrices[0]?.billingInterval;
              return defaultInterval ? { defaultInterval } : {};
            })(),
            prices: (p.prices ?? []).map((pr) => ({
              interval: pr.billingInterval,
              amount: pr.price,
              ...(pr.trialDays ? { trialDays: pr.trialDays } : {}),
            })),
          },
        ]),
      ),
    };

    const localAsRemote: RemoteState = {
      features: Object.entries(localConfig.features).map(([code, f]) => ({
        code,
        name: f.name,
        type: f.type,
        description: f.description ?? null,
        unitName: f.unitName ?? null,
      })),
      plans: Object.entries(localConfig.plans).map(([code, p]) => ({
        code,
        name: p.name,
        description: p.description ?? null,
        consumptionModel: p.consumptionModel ?? null,
        defaultInterval: p.defaultInterval ?? null,
        isFree: p.isFree,
        isPublic: p.isPublic,
        sortOrder: p.sortOrder,
        prices: p.prices.map((pr) => ({
          billingInterval: pr.interval,
          price: pr.amount,
          trialDays: pr.trialDays ?? null,
        })),
        features: [],
      })),
    };

    const diff = computeDiff(remoteAsConfig, localAsRemote);

    if (
      !diff.hasChanges &&
      diff.features.unmanaged.length === 0 &&
      diff.plans.unmanaged.length === 0
    ) {
      if (agentMode) {
        console.log(JSON.stringify({ diff, applied: false, upToDate: true }));
      } else {
        console.log(chalk.green("\n✓ Already up to date"));
      }
      return;
    }

    if (agentMode) {
      if (options.dryRun) {
        console.log(JSON.stringify({ diff, applied: false }));
        return;
      }
    } else {
      console.log(formatDiff(diff));
    }

    if (options.dryRun) {
      if (!agentMode) {
        console.log(chalk.dim("\n(dry run — no changes applied)"));
      }
      return;
    }

    if (!options.yes && !agentMode) {
      const shouldProceed = await confirm({
        message: "Overwrite commet.config.ts with remote state?",
        default: true,
      });

      if (!shouldProceed) {
        console.log(chalk.dim("Pull cancelled"));
        return;
      }
    }

    fs.writeFileSync(outputPath, configContent, "utf8");

    if (agentMode) {
      console.log(JSON.stringify({ diff, applied: true }));
    } else {
      console.log(chalk.green("\n✓ Updated commet.config.ts"));
      console.log(
        chalk.dim(`  ${features.length} features, ${plans.length} plans`),
      );
    }
  });
