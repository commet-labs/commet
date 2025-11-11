import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, getBaseURL } from "../utils/api";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";
import { validateTypeScriptProject } from "../utils/environment-validator";
import { generateTypes } from "../utils/generator";
import { updateGitignore } from "../utils/gitignore-updater";
import { updateTsConfig } from "../utils/tsconfig-updater";

interface EventType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface SeatType {
  id: string;
  code: string;
  name: string;
  description?: string;
  isFree: boolean;
}

interface Product {
  publicId: string;
  name: string;
  description?: string;
}

interface TypesResponse {
  success: boolean;
  eventTypes: EventType[];
  seatTypes: SeatType[];
  products: Product[];
}

export const pullCommand = new Command("pull")
  .description("Pull type definitions from Commet")
  .action(async () => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

    // Validate TypeScript project (warning only, doesn't stop execution)
    const hasTsConfig = validateTypeScriptProject();

    // Check project config
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

    const spinner = ora("Fetching type definitions...").start();

    // Fetch types from API
    const baseURL = getBaseURL(projectConfig.environment);
    const result = await apiRequest<TypesResponse>(
      `${baseURL}/api/cli/types?orgId=${projectConfig.orgId}`,
    );

    if (result.error || !result.data) {
      spinner.fail("Failed to fetch types");
      console.error(chalk.red("Error:"), result.error);
      return;
    }

    const { eventTypes, seatTypes, products } = result.data;

    // Generate TypeScript definitions
    const typeDefinitions = generateTypes(eventTypes, seatTypes, products);

    // Write to .commet/types.d.ts
    const commetDir = path.resolve(process.cwd(), ".commet");
    const outputPath = path.join(commetDir, "types.d.ts");

    // Ensure .commet directory exists
    fs.mkdirSync(commetDir, { recursive: true });

    // Write types file
    fs.writeFileSync(outputPath, typeDefinitions, "utf8");

    spinner.succeed("Type definitions generated!");

    // Update tsconfig.json (only if we found one earlier)
    if (hasTsConfig) {
      const tsconfigResult = updateTsConfig(".commet/types.d.ts");
      if (tsconfigResult.success) {
        console.log(chalk.green("✓ Updated tsconfig.json"));
      } else {
        console.log(chalk.yellow("⚠ Could not update tsconfig.json"));
        console.log(
          chalk.dim(
            'Add ".commet/types.d.ts" to your tsconfig.json include array',
          ),
        );
      }
    } else {
      console.log(chalk.yellow("⚠ No tsconfig.json found"));
      console.log(
        chalk.dim(
          'Add ".commet/types.d.ts" to your tsconfig.json to enable types',
        ),
      );
    }

    // Update .gitignore
    const gitignoreResult = updateGitignore(".commet/");
    if (gitignoreResult.success) {
      console.log(chalk.green("✓ Updated .gitignore"));
    } else {
      console.log(chalk.yellow("⚠ No .gitignore found"));
      console.log(chalk.dim("Add .commet/ to your .gitignore file"));
    }

    console.log(chalk.green("\nSuccess!"));
    console.log(chalk.dim("\nGenerated types:"));
    console.log(
      chalk.dim(
        `  Event types: ${eventTypes.length > 0 ? eventTypes.map((e) => e.code).join(", ") : "none"}`,
      ),
    );
    console.log(
      chalk.dim(
        `  Seat types: ${seatTypes.length > 0 ? seatTypes.map((s) => s.code).join(", ") : "none"}`,
      ),
    );
    console.log(
      chalk.dim(
        `  Products: ${products.length > 0 ? products.map((p) => p.publicId).join(", ") : "none"}`,
      ),
    );
    console.log(chalk.dim(`\nOutput: ${outputPath}`));

    if (
      eventTypes.length === 0 &&
      seatTypes.length === 0 &&
      products.length === 0
    ) {
      console.log(
        chalk.yellow(
          "\n⚠ No types found. Create event types, seat types, and products in your Commet dashboard.",
        ),
      );
    }
  });
