import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { apiRequest, getBaseURL } from "../utils/api";
import {
  authExists,
  projectConfigExists,
  saveProjectConfig,
  loadAuth,
} from "../utils/config";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrganizationsResponse {
  success: boolean;
  organizations: Organization[];
}

export const switchCommand = new Command("switch")
  .description("Switch to a different organization")
  .action(async () => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

    // Check if project is linked
    if (!projectConfigExists()) {
      console.log(chalk.yellow("⚠ Project not linked"));
      console.log(
        chalk.dim("Run `commet link` first to connect to an organization"),
      );
      return;
    }

    const spinner = ora("Fetching organizations...").start();

    // Fetch user's organizations from the authenticated environment
    const auth = loadAuth();
    if (!auth) {
      spinner.fail("Authentication error");
      console.log(chalk.red("✗ Could not load authentication"));
      return;
    }

    const baseURL = getBaseURL(auth.environment);
    const result = await apiRequest<OrganizationsResponse>(
      `${baseURL}/api/cli/organizations`,
    );

    if (result.error || !result.data) {
      spinner.fail("Failed to fetch organizations");
      console.error(chalk.red("Error:"), result.error);
      return;
    }

    const { organizations } = result.data;

    if (organizations.length === 0) {
      spinner.stop();
      console.log(chalk.yellow("⚠ No organizations found"));
      return;
    }

    spinner.stop();

    // Prompt user to select organization and environment
    const answers = await inquirer.prompt<{
      orgId: string;
      environment: "sandbox" | "production";
    }>([
      {
        type: "list",
        name: "orgId",
        message: "Select organization:",
        choices: organizations.map((org) => ({
          name: `${org.name} (${org.slug})`,
          value: org.id,
        })),
      },
      {
        type: "list",
        name: "environment",
        message: "Select environment:",
        choices: [
          { name: "Sandbox (Development)", value: "sandbox" },
          { name: "Production", value: "production" },
        ],
        default: "sandbox",
      },
    ]);

    const selectedOrg = organizations.find((org) => org.id === answers.orgId);
    if (!selectedOrg) {
      console.log(chalk.red("✗ Organization not found"));
      return;
    }

    // Save project config
    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      environment: answers.environment,
    });

    console.log(chalk.green("\n✓ Switched organization successfully!"));
    console.log(chalk.dim("\nNew configuration:"));
    console.log(chalk.dim(`  Organization: ${selectedOrg.name}`));
    console.log(chalk.dim(`  Environment: ${answers.environment}`));
    console.log(
      chalk.dim(
        "\nRun `commet pull` to update TypeScript types for this organization",
      ),
    );
  });
