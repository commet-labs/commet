import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, getBaseURL } from "../utils/api";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";

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

export const listCommand = new Command("list")
  .description("List event types or seat types")
  .argument("<type>", "Type to list (events or seats)")
  .action(async (type: string) => {
    // Validate type argument
    if (type !== "events" && type !== "seats") {
      console.log(chalk.red('✗ Invalid type. Use "events" or "seats"'));
      console.log(chalk.dim("\nExamples:"));
      console.log(chalk.dim("  commet list events"));
      console.log(chalk.dim("  commet list seats"));
      return;
    }

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

    const spinner = ora(`Fetching ${type}...`).start();

    // Fetch types from API
    const baseURL = getBaseURL(projectConfig.environment);
    const result = await apiRequest<TypesResponse>(
      `${baseURL}/cli/types?orgId=${projectConfig.orgId}`,
    );

    if (result.error || !result.data) {
      spinner.fail(`Failed to fetch ${type}`);
      console.error(chalk.red("Error:"), result.error);
      return;
    }

    spinner.stop();

    // Display results
    if (type === "events") {
      const { eventTypes } = result.data;

      if (eventTypes.length === 0) {
        console.log(chalk.yellow("⚠ No event types found"));
        console.log(
          chalk.dim("Create event types in your Commet dashboard first"),
        );
        return;
      }

      console.log(chalk.bold(`\n📊 Event Types (${eventTypes.length})\n`));
      for (const eventType of eventTypes) {
        console.log(chalk.green(`• ${eventType.code}`));
        console.log(chalk.dim(`  ${eventType.name}`));
        if (eventType.description) {
          console.log(chalk.dim(`  ${eventType.description}`));
        }
        console.log("");
      }
    } else {
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
    }
  });
