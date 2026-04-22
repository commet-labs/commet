import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
  projectConfigExists,
  saveProjectConfig,
} from "../utils/config";
import { promptTheme } from "../utils/prompt-theme";

interface Organization {
  id: string;
  name: string;
  slug: string;
  mode: "live" | "sandbox";
}

interface OrganizationsResponse {
  success: boolean;
  organizations: Organization[];
}

export const switchCommand = new Command("switch")
  .description("Switch to a different organization")
  .action(async () => {
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      return;
    }

    if (!projectConfigExists()) {
      console.log(chalk.yellow("⚠ Project not linked"));
      console.log(
        chalk.dim("Run `commet link` first to connect to an organization"),
      );
      return;
    }

    const spinner = ora("Fetching organizations...").start();

    const result = await apiRequest<OrganizationsResponse>(
      `${BASE_URL}/api/cli/organizations`,
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

    let orgId: string;
    try {
      orgId = await select({
        message: "Select organization:",
        choices: organizations.map((org) => ({
          name: `${org.name} ${chalk.dim(`(${org.slug}) · ${org.mode}`)}`,
          value: org.id,
        })),
        theme: promptTheme,
      });
    } catch (_error) {
      console.log(chalk.yellow("\n⚠ Switch cancelled"));
      return;
    }

    const selectedOrg = organizations.find((org) => org.id === orgId);
    if (!selectedOrg) {
      console.log(chalk.red("✗ Organization not found"));
      return;
    }

    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      mode: selectedOrg.mode,
    });

    console.log(chalk.green("\n✓ Switched organization successfully!"));
    console.log(
      chalk.dim(`\nOrganization: ${selectedOrg.name} · ${selectedOrg.mode}`),
    );
    console.log(
      chalk.dim(
        "\nRun `commet pull` to update TypeScript types for this organization",
      ),
    );
  });
