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
import { generateTypes } from "../utils/generator";

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

interface TypesResponse {
  success: boolean;
  eventTypes: EventType[];
  seatTypes: SeatType[];
}

export const pullCommand = new Command("pull")
  .description("Pull type definitions from Commet")
  .option("-o, --output <file>", "Output file path", ".commet.d.ts")
  .action(async (options: { output: string }) => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

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

    const { eventTypes, seatTypes } = result.data;

    // Generate TypeScript definitions
    const typeDefinitions = generateTypes(eventTypes, seatTypes);

    // Write to file
    const outputPath = path.resolve(process.cwd(), options.output);
    fs.writeFileSync(outputPath, typeDefinitions, "utf8");

    spinner.succeed("Type definitions generated!");

    console.log(chalk.green("\n✓ Success"));
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
    console.log(chalk.dim(`\nOutput file: ${outputPath}`));

    if (eventTypes.length === 0 && seatTypes.length === 0) {
      console.log(
        chalk.yellow(
          "\n⚠ No types found. Create event types and seat types in your Commet dashboard.",
        ),
      );
    }
  });
