import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";
import { loadBillingConfig } from "../utils/config-loader";
import { computeDiff, formatDiff, type RemoteState } from "../utils/diff";

interface ConfigResponse {
  success: boolean;
  features: RemoteState["features"];
  plans: RemoteState["plans"];
}

interface PushResponse {
  success: boolean;
  features: {
    created: string[];
    updated: string[];
    errors: Array<{ code: string; message: string }>;
  };
  plans: {
    created: string[];
    updated: string[];
    errors: Array<{ code: string; message: string }>;
  };
}

interface PushOptions {
  yes?: boolean;
  dryRun?: boolean;
  json?: boolean;
}

export const pushCommand = new Command("push")
  .description("Push commet.config.ts to your Commet organization")
  .option("-y, --yes", "Skip confirmation prompt")
  .option("--dry-run", "Show diff without applying changes")
  .option("--json", "Output structured JSON (no colors, no prompts)")
  .action(async (options: PushOptions) => {
    const jsonMode = options.json;

    if (!authExists()) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Not authenticated" }));
      } else {
        console.log(chalk.red("✗ Not authenticated"));
        console.log(chalk.dim("Run `commet login` first"));
      }
      return;
    }

    if (!projectConfigExists()) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Project not linked" }));
      } else {
        console.log(chalk.red("✗ Project not linked"));
        console.log(
          chalk.dim("Run `commet link` first to connect to an organization"),
        );
      }
      return;
    }

    const projectConfig = loadProjectConfig();
    if (!projectConfig) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Invalid project configuration" }));
      } else {
        console.log(chalk.red("✗ Invalid project configuration"));
      }
      return;
    }

    const loadSpinner = jsonMode
      ? null
      : ora("Loading commet.config.ts...").start();

    const loaded = await loadBillingConfig(process.cwd()).catch(
      (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (jsonMode) {
          console.log(JSON.stringify({ error: message }));
        } else {
          loadSpinner?.fail("Failed to load config");
          console.error(chalk.red(message));
        }
        return null;
      },
    );

    if (!loaded) return;

    const { config, configPath } = loaded;
    loadSpinner?.succeed(`Loaded ${configPath}`);

    const fetchSpinner = jsonMode
      ? null
      : ora("Fetching remote state...").start();

    const remoteResult = await apiRequest<ConfigResponse>(
      `${BASE_URL}/api/cli/types?orgId=${projectConfig.orgId}&mode=config`,
    );

    if (remoteResult.error || !remoteResult.data) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: remoteResult.error }));
      } else {
        fetchSpinner?.fail("Failed to fetch remote state");
        console.error(chalk.red("Error:"), remoteResult.error);
      }
      return;
    }

    fetchSpinner?.succeed("Remote state fetched");

    const remote: RemoteState = {
      features: remoteResult.data.features,
      plans: remoteResult.data.plans,
    };

    const diff = computeDiff(config, remote);

    if (jsonMode) {
      if (options.dryRun) {
        console.log(JSON.stringify({ diff, applied: false }));
        return;
      }
    } else {
      console.log(formatDiff(diff));
    }

    if (!diff.hasChanges) {
      if (jsonMode) {
        console.log(JSON.stringify({ diff, applied: false, upToDate: true }));
      } else {
        console.log(chalk.green("\n✓ Everything is up to date"));
      }
      return;
    }

    const typeChanges = diff.features.changes.filter(
      (c) =>
        c.action === "update" &&
        c.changes?.some((ch) => ch.includes("BLOCKED")),
    );
    if (typeChanges.length > 0) {
      const blockedCodes = typeChanges.map((c) => c.code);
      if (jsonMode) {
        console.log(
          JSON.stringify({
            error: "Feature type changes blocked",
            blockedCodes,
            diff,
          }),
        );
      } else {
        console.log(
          chalk.red(
            "\n✗ Cannot change feature types. Update them in the dashboard:",
          ),
        );
        for (const change of typeChanges) {
          console.log(chalk.red(`  - ${change.code}`));
        }
      }
      return;
    }

    if (options.dryRun) {
      if (!jsonMode) {
        console.log(chalk.dim("\n(dry run — no changes applied)"));
      }
      return;
    }

    if (!options.yes && !jsonMode) {
      const shouldProceed = await confirm({
        message: "Apply these changes?",
        default: true,
      });

      if (!shouldProceed) {
        console.log(chalk.dim("Push cancelled"));
        return;
      }
    }

    const pushSpinner = jsonMode ? null : ora("Pushing config...").start();

    const pushResult = await apiRequest<PushResponse>(
      `${BASE_URL}/api/cli/push`,
      {
        method: "POST",
        body: JSON.stringify({
          orgId: projectConfig.orgId,
          config: {
            features: config.features,
            plans: config.plans,
          },
        }),
      },
    );

    if (pushResult.error || !pushResult.data) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: pushResult.error }));
      } else {
        pushSpinner?.fail("Push failed");
        console.error(chalk.red("Error:"), pushResult.error);
      }
      return;
    }

    const result = pushResult.data;

    if (jsonMode) {
      console.log(JSON.stringify({ diff, applied: true, result }));
      return;
    }

    const errors = [...result.features.errors, ...result.plans.errors];

    if (errors.length > 0) {
      pushSpinner?.warn("Push completed with errors");
      for (const error of errors) {
        console.log(chalk.red(`  ✗ ${error.code}: ${error.message}`));
      }
    } else {
      pushSpinner?.succeed("Push complete");
    }

    if (result.features.created.length > 0) {
      console.log(
        chalk.green(
          `  Created features: ${result.features.created.join(", ")}`,
        ),
      );
    }
    if (result.features.updated.length > 0) {
      console.log(
        chalk.yellow(
          `  Updated features: ${result.features.updated.join(", ")}`,
        ),
      );
    }
    if (result.plans.created.length > 0) {
      console.log(
        chalk.green(`  Created plans: ${result.plans.created.join(", ")}`),
      );
    }
    if (result.plans.updated.length > 0) {
      console.log(
        chalk.yellow(`  Updated plans: ${result.plans.updated.join(", ")}`),
      );
    }
  });
