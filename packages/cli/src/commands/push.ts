import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import { loadBillingConfig } from "../utils/config-loader";
import { computeDiff, formatDiff } from "../utils/diff";
import { isAgentMode, requireOrgContext } from "../utils/output";
import { createSdkClient, fetchRemoteState } from "../utils/sdk";

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
  output?: string;
}

export const pushCommand = new Command("push")
  .description(
    "Push your local commet.config.ts to Commet. Creates or updates features and plans to match your config file.",
  )
  .option("-y, --yes", "Skip confirmation prompt")
  .option("--dry-run", "Show what would change without pushing")
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet push                  Interactive — shows diff, asks to confirm
  $ commet push --dry-run        Preview what would change on remote
  $ commet push --yes            Push without confirmation
  $ commet push --output agent --yes   Agent/CI — structured JSON, no prompts
  $ COMMET_API_KEY=ck_... commet push --yes   CI pipeline
`,
  )
  .action(async (options: PushOptions) => {
    const agentMode = isAgentMode(options);
    const { orgId } = requireOrgContext();

    const loadSpinner = agentMode
      ? null
      : ora("Loading commet.config.ts...").start();

    const loaded = await loadBillingConfig(process.cwd()).catch(
      (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (agentMode) {
          console.log(
            JSON.stringify({
              error: { code: "config_invalid", message },
            }),
          );
        } else {
          loadSpinner?.fail("Failed to load config");
          console.error(chalk.red(message));
        }
        return null;
      },
    );

    if (!loaded) process.exit(1);

    const { config, configPath } = loaded;
    loadSpinner?.succeed(`Loaded ${configPath}`);

    const fetchSpinner = agentMode
      ? null
      : ora("Fetching remote state...").start();

    const commet = createSdkClient();
    const remoteState = await fetchRemoteState(commet);

    if ("error" in remoteState) {
      if (agentMode) {
        console.log(JSON.stringify({ error: remoteState.error }));
      } else {
        fetchSpinner?.fail("Failed to fetch remote state");
        console.error(chalk.red("Error:"), remoteState.error.message);
      }
      process.exit(1);
    }

    fetchSpinner?.succeed("Remote state fetched");

    const diff = computeDiff(config, remoteState);

    if (agentMode) {
      if (options.dryRun) {
        console.log(JSON.stringify({ diff, applied: false }));
        return;
      }
    } else {
      console.log(formatDiff(diff));
    }

    if (!diff.hasChanges) {
      if (agentMode) {
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
      if (agentMode) {
        console.log(
          JSON.stringify({
            error: {
              code: "type_change_blocked",
              message: "Feature type changes must be done in the dashboard",
            },
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
      process.exit(1);
    }

    if (options.dryRun) {
      if (!agentMode) {
        console.log(chalk.dim("\n(dry run — no changes applied)"));
      }
      return;
    }

    if (!options.yes && !agentMode) {
      const shouldProceed = await confirm({
        message: "Apply these changes?",
        default: true,
      });

      if (!shouldProceed) {
        console.log(chalk.dim("Push cancelled"));
        return;
      }
    }

    const pushSpinner = agentMode ? null : ora("Pushing config...").start();

    const pushBody: Record<string, unknown> = {
      config: { features: config.features, plans: config.plans },
    };
    if (orgId !== "__from_api_key__") {
      pushBody.orgId = orgId;
    }

    const pushResult = await apiRequest<PushResponse>(
      `${BASE_URL}/api/cli/push`,
      { method: "POST", body: JSON.stringify(pushBody) },
    );

    if (pushResult.error || !pushResult.data) {
      if (agentMode) {
        console.log(JSON.stringify({ error: pushResult.error }));
      } else {
        pushSpinner?.fail("Push failed");
        console.error(chalk.red("Error:"), pushResult.error?.message);
      }
      process.exit(1);
    }

    const pushOutcome = pushResult.data;

    if (agentMode) {
      console.log(JSON.stringify({ diff, applied: true, result: pushOutcome }));
      return;
    }

    const errors = [
      ...pushOutcome.features.errors,
      ...pushOutcome.plans.errors,
    ];

    if (errors.length > 0) {
      pushSpinner?.warn("Push completed with errors");
      for (const error of errors) {
        console.log(chalk.red(`  ✗ ${error.code}: ${error.message}`));
      }
    } else {
      pushSpinner?.succeed("Push complete");
    }

    if (pushOutcome.features.created.length > 0) {
      console.log(
        chalk.green(
          `  Created features: ${pushOutcome.features.created.join(", ")}`,
        ),
      );
    }
    if (pushOutcome.features.updated.length > 0) {
      console.log(
        chalk.yellow(
          `  Updated features: ${pushOutcome.features.updated.join(", ")}`,
        ),
      );
    }
    if (pushOutcome.plans.created.length > 0) {
      console.log(
        chalk.green(`  Created plans: ${pushOutcome.plans.created.join(", ")}`),
      );
    }
    if (pushOutcome.plans.updated.length > 0) {
      console.log(
        chalk.yellow(
          `  Updated plans: ${pushOutcome.plans.updated.join(", ")}`,
        ),
      );
    }
  });
