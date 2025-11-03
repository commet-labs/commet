import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, getApiBaseURL } from "../utils/api";
import {
  authExists,
  loadAuth,
  loadProjectConfig,
  projectConfigExists,
  saveProjectConfig,
} from "../utils/config";
import { updateGitignore } from "../utils/gitignore-updater";
import { promptTheme } from "../utils/prompt-theme";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrganizationsResponse {
  success: boolean;
  organizations: Organization[];
}

export const linkCommand = new Command("link")
  .description("Link this project to a Commet organization")
  .action(async () => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

    // Check if already linked
    if (projectConfigExists()) {
      const config = loadProjectConfig();
      console.log(chalk.yellow("⚠ This project is already linked"));
      console.log(
        chalk.dim(`Organization: ${config?.orgName} (${config?.environment})`),
      );
      console.log(
        chalk.dim(
          "\nRun `commet unlink` first if you want to change the organization",
        ),
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

    const baseURL = getApiBaseURL(auth.environment);
    const result = await apiRequest<OrganizationsResponse>(
      `${baseURL}/cli/organizations`,
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
      console.log(
        chalk.dim("Create an organization at https://billing.commet.co first"),
      );
      return;
    }

    spinner.stop();

    // Prompt user to select organization only
    // Environment is already determined by the auth token
    let orgId: string;
    try {
      orgId = await select({
        message: "Select organization:",
        choices: organizations.map((org) => ({
          name: `${org.name} ${chalk.dim(`(${org.slug})`)}`,
          value: org.id,
        })),
        theme: promptTheme,
      });
    } catch (error) {
      // User cancelled with Ctrl+C
      console.log(chalk.yellow("\n⚠ Link cancelled"));
      return;
    }

    const selectedOrg = organizations.find((org) => org.id === orgId);
    if (!selectedOrg) {
      console.log(chalk.red("✗ Organization not found"));
      return;
    }

    // Save project config
    // Environment comes from the auth token (sandbox or production)
    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      environment: auth.environment,
    });

    // Update .gitignore
    const gitignoreResult = updateGitignore(".commet/");

    console.log(chalk.green("\n✓ Project linked successfully"));
    console.log(chalk.dim(`Organization: ${selectedOrg.name}`));
    console.log(chalk.dim(`Environment: ${auth.environment}`));

    if (gitignoreResult.success) {
      console.log(chalk.green("✓ Updated .gitignore"));
    } else {
      console.log(chalk.yellow("⚠ No .gitignore found"));
      console.log(chalk.dim("Add .commet/ to your .gitignore file"));
    }

    console.log(chalk.dim("\nRun 'commet pull' to generate TypeScript types"));
  });
