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

interface SwitchOptions {
  org?: string;
}

export const switchCommand = new Command("switch")
  .description(
    "Switch this project to a different organization. Updates .commet/config.json with the new org.",
  )
  .option(
    "--org <slug-or-id>",
    "Organization slug or ID — skips interactive selection",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet switch                Interactive — choose from a list
  $ commet switch --org acme     Non-interactive — match by slug or ID

Use 'commet orgs' to see available organizations and their slugs.
After switching, run 'commet pull' to update your config file.
`,
  )
  .action(async (options: SwitchOptions) => {
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      process.exit(1);
    }

    if (!projectConfigExists()) {
      console.log(chalk.yellow("⚠ Project not linked"));
      console.log(
        chalk.dim("Run `commet link` first to connect to an organization"),
      );
      process.exit(1);
    }

    const spinner = ora("Fetching organizations...").start();

    const result = await apiRequest<OrganizationsResponse>(
      `${BASE_URL}/api/cli/organizations`,
    );

    if (result.error || !result.data) {
      spinner.fail("Failed to fetch organizations");
      console.error(chalk.red("Error:"), result.error);
      process.exit(1);
    }

    const { organizations } = result.data;

    if (organizations.length === 0) {
      spinner.stop();
      console.log(chalk.yellow("⚠ No organizations found"));
      process.exit(1);
    }

    spinner.stop();

    let selectedOrg: Organization | undefined;

    if (options.org) {
      selectedOrg = organizations.find(
        (org) => org.slug === options.org || org.id === options.org,
      );
      if (!selectedOrg) {
        console.log(
          chalk.red(`✗ Organization "${options.org}" not found`),
        );
        console.log(chalk.dim("\nAvailable organizations:"));
        for (const org of organizations) {
          console.log(chalk.dim(`  ${org.slug} (${org.mode})`));
        }
        process.exit(1);
      }
    } else {
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

      selectedOrg = organizations.find((org) => org.id === orgId);
      if (!selectedOrg) {
        console.log(chalk.red("✗ Organization not found"));
        process.exit(1);
      }
    }

    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      mode: selectedOrg.mode,
    });

    console.log(chalk.green("\n✓ Switched organization"));
    console.log(
      chalk.dim(`Organization: ${selectedOrg.name} · ${selectedOrg.mode}`),
    );
    console.log(
      chalk.dim(
        "\nRun `commet pull` to update TypeScript types for this organization",
      ),
    );
  });
