import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";
import { generateConfigFile } from "../utils/generator";

interface Feature {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string | null;
  type: string;
  unitName?: string | null;
}

interface Plan {
  id: string;
  publicId: string;
  code: string;
  name: string;
  description?: string | null;
  consumptionModel?: string | null;
  isFree?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  prices?: Array<{
    billingInterval: string;
    price: number;
    trialDays?: number | null;
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

export const pullCommand = new Command("pull")
  .description("Pull config from Commet and generate commet.config.ts")
  .action(async () => {
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

    const spinner = ora("Fetching config from remote...").start();

    const result = await apiRequest<ConfigResponse>(
      `${BASE_URL}/api/cli/types?orgId=${projectConfig.orgId}&mode=config`,
    );

    if (result.error || !result.data) {
      spinner.fail("Failed to fetch config");
      console.error(chalk.red("Error:"), result.error);
      return;
    }

    const { features, plans } = result.data;

    const configContent = generateConfigFile(features, plans);
    const outputPath = path.resolve(process.cwd(), "commet.config.ts");
    fs.writeFileSync(outputPath, configContent, "utf8");

    spinner.succeed("Config file generated!");
    console.log(
      chalk.dim(`  ${features.length} features, ${plans.length} plans`),
    );
    console.log(chalk.dim(`  Output: ${outputPath}`));

    if (features.length === 0 && plans.length === 0) {
      console.log(
        chalk.yellow(
          "\n⚠ No resources found. Create features and plans in the dashboard or define them in commet.config.ts and run 'commet push'.",
        ),
      );
    }
  });
