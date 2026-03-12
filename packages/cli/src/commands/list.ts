import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, getBaseURL } from "../utils/api";
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

export const listCommand = new Command("list")
  .description("List features, seat types, or plans")
  .argument("<type>", "Type to list (features, seats, or plans)")
  .action(async (type: string) => {
    if (!validTypes.includes(type as ListType)) {
      console.log(
        chalk.red('✗ Invalid type. Use "features", "seats", or "plans"'),
      );
      console.log(chalk.dim("\nExamples:"));
      console.log(chalk.dim("  commet list features"));
      console.log(chalk.dim("  commet list seats"));
      console.log(chalk.dim("  commet list plans"));
      return;
    }

    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

    if (!projectConfigExists()) {
      console.log(chalk.red("✗ Project not linked"));
      console.log(
        chalk.dim("Run `commet link` first to connect to an organization"),
      );
      return;
    }

    const projectConfig = loadProjectConfig();
    if (!projectConfig) {
      console.log(chalk.red("✗ Invalid project configuration"));
      return;
    }

    const spinner = ora(`Fetching ${type}...`).start();

    const baseURL = getBaseURL(projectConfig.environment);
    const result = await apiRequest<TypesResponse>(
      `${baseURL}/api/cli/types?orgId=${projectConfig.orgId}`,
    );

    if (result.error || !result.data) {
      spinner.fail(`Failed to fetch ${type}`);
      console.error(chalk.red("Error:"), result.error);
      return;
    }

    spinner.stop();

    if (type === "features") {
      const { features } = result.data;

      if (features.length === 0) {
        console.log(chalk.yellow("⚠ No features found"));
        console.log(
          chalk.dim("Create features in your Commet dashboard first"),
        );
        return;
      }

      console.log(chalk.bold(`\n📊 Features (${features.length})\n`));
      for (const feature of features) {
        console.log(chalk.green(`• ${feature.code} (${feature.type})`));
        console.log(chalk.dim(`  ${feature.name}`));
        if (feature.description) {
          console.log(chalk.dim(`  ${feature.description}`));
        }
        console.log("");
      }
    } else if (type === "seats") {
      const { seatTypes } = result.data;

      if (seatTypes.length === 0) {
        console.log(chalk.yellow("⚠ No seat types found"));
        console.log(
          chalk.dim("Create seat types in your Commet dashboard first"),
        );
        return;
      }

      console.log(chalk.bold(`\n💺 Seat Types (${seatTypes.length})\n`));
      for (const seatType of seatTypes) {
        console.log(
          chalk.green(`• ${seatType.code}${seatType.isFree ? " (Free)" : ""}`),
        );
        console.log(chalk.dim(`  ${seatType.name}`));
        if (seatType.description) {
          console.log(chalk.dim(`  ${seatType.description}`));
        }
        console.log("");
      }
    } else {
      const { plans } = result.data;

      if (plans.length === 0) {
        console.log(chalk.yellow("⚠ No plans found"));
        console.log(chalk.dim("Create plans in your Commet dashboard first"));
        return;
      }

      console.log(chalk.bold(`\n📋 Plans (${plans.length})\n`));
      for (const plan of plans) {
        console.log(chalk.green(`• ${plan.code}`));
        console.log(chalk.dim(`  ${plan.name}`));
        if (plan.description) {
          console.log(chalk.dim(`  ${plan.description}`));
        }
        console.log("");
      }
    }
  });
