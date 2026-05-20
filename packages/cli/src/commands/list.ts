import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";

interface SeatType {
  id: string;
  code: string;
  name: string;
  description?: string;
  isFree: boolean;
}

interface Feature {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string;
  type: string;
}

interface Plan {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string;
}

interface TypesResponse {
  success: boolean;
  seatTypes: SeatType[];
  features: Feature[];
  plans: Plan[];
}

const validTypes = ["features", "seats", "plans"] as const;
type ListType = (typeof validTypes)[number];

interface ListOptions {
  json?: boolean;
}

export const listCommand = new Command("list")
  .description(
    "List resources from your linked organization. Shows features, seat types, or plans currently configured on remote.",
  )
  .argument("<type>", "What to list: features, seats, or plans")
  .option("--json", "Output as JSON array")
  .addHelpText(
    "after",
    `
Examples:
  $ commet list features         Show all features with type and description
  $ commet list plans            Show all plans
  $ commet list seats            Show all seat types
  $ commet list features --json  JSON array for agent/CI use
`,
  )
  .action(async (type: string, options: ListOptions) => {
    const jsonMode = options.json;

    if (!validTypes.includes(type as ListType)) {
      if (jsonMode) {
        console.log(
          JSON.stringify({
            error: `Invalid type "${type}". Use: features, seats, or plans`,
          }),
        );
      } else {
        console.log(
          chalk.red('✗ Invalid type. Use "features", "seats", or "plans"'),
        );
        console.log(chalk.dim("\nExamples:"));
        console.log(chalk.dim("  commet list features"));
        console.log(chalk.dim("  commet list seats"));
        console.log(chalk.dim("  commet list plans"));
      }
      process.exit(1);
    }

    if (!authExists()) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Not authenticated" }));
      } else {
        console.log(chalk.red("✗ Not authenticated"));
        console.log(chalk.dim("Run `commet login` first"));
      }
      process.exit(1);
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
      process.exit(1);
    }

    const projectConfig = loadProjectConfig();
    if (!projectConfig) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Invalid project configuration" }));
      } else {
        console.log(chalk.red("✗ Invalid project configuration"));
      }
      process.exit(1);
    }

    const spinner = jsonMode ? null : ora(`Fetching ${type}...`).start();

    const result = await apiRequest<TypesResponse>(
      `${BASE_URL}/api/cli/pull?orgId=${projectConfig.orgId}`,
    );

    if (result.error || !result.data) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: result.error }));
      } else {
        spinner?.fail(`Failed to fetch ${type}`);
        console.error(chalk.red("Error:"), result.error);
      }
      process.exit(1);
    }

    spinner?.stop();

    if (type === "features") {
      const { features } = result.data;

      if (jsonMode) {
        console.log(JSON.stringify(features));
        return;
      }

      if (features.length === 0) {
        console.log(chalk.yellow("⚠ No features found"));
        console.log(
          chalk.dim("Create features in your Commet dashboard first"),
        );
        return;
      }

      console.log(chalk.bold(`\n  Features (${features.length})\n`));
      for (const feature of features) {
        console.log(
          chalk.green(`  ${feature.code} ${chalk.dim(`(${feature.type})`)}`),
        );
        console.log(chalk.dim(`    ${feature.name}`));
        if (feature.description) {
          console.log(chalk.dim(`    ${feature.description}`));
        }
        console.log("");
      }
    } else if (type === "seats") {
      const { seatTypes } = result.data;

      if (jsonMode) {
        console.log(JSON.stringify(seatTypes));
        return;
      }

      if (seatTypes.length === 0) {
        console.log(chalk.yellow("⚠ No seat types found"));
        console.log(
          chalk.dim("Create seat types in your Commet dashboard first"),
        );
        return;
      }

      console.log(chalk.bold(`\n  Seat Types (${seatTypes.length})\n`));
      for (const seatType of seatTypes) {
        console.log(
          chalk.green(
            `  ${seatType.code}${seatType.isFree ? chalk.dim(" (free)") : ""}`,
          ),
        );
        console.log(chalk.dim(`    ${seatType.name}`));
        if (seatType.description) {
          console.log(chalk.dim(`    ${seatType.description}`));
        }
        console.log("");
      }
    } else {
      const { plans } = result.data;

      if (jsonMode) {
        console.log(JSON.stringify(plans));
        return;
      }

      if (plans.length === 0) {
        console.log(chalk.yellow("⚠ No plans found"));
        console.log(chalk.dim("Create plans in your Commet dashboard first"));
        return;
      }

      console.log(chalk.bold(`\n  Plans (${plans.length})\n`));
      for (const plan of plans) {
        console.log(chalk.green(`  ${plan.code}`));
        console.log(chalk.dim(`    ${plan.name}`));
        if (plan.description) {
          console.log(chalk.dim(`    ${plan.description}`));
        }
        console.log("");
      }
    }
  });
