import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
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
  mode: "live" | "sandbox";
}

interface OrganizationsResponse {
  success: boolean;
  organizations: Organization[];
}

interface LinkOptions {
  org?: string;
}

export const linkCommand = new Command("link")
  .description(
    "Link this project directory to a Commet organization. Creates .commet/config.json with the selected org.",
  )
  .option(
    "--org <slug-or-id>",
    "Organization slug or ID — skips interactive selection",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet link                  Interactive — choose from a list
  $ commet link --org acme       Non-interactive — match by slug or ID

Use 'commet orgs' to see available organizations and their slugs.
`,
  )
  .action(async (options: LinkOptions) => {
    if (!authExists()) {
      console.log(chalk.red("✗ Not authenticated"));
      console.log(chalk.dim("Run `commet login` first"));
      process.exit(1);
    }

    if (projectConfigExists()) {
      const config = loadProjectConfig();
      console.log(chalk.yellow("⚠ This project is already linked"));
      console.log(
        chalk.dim(`Organization: ${config?.orgName} · ${config?.mode}`),
      );
      console.log(
        chalk.dim(
          "\nRun `commet unlink` first if you want to change the organization",
        ),
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
      process.exit(1);
    }

    const { organizations } = result.data;

    if (organizations.length === 0) {
      spinner.stop();
      console.log(chalk.yellow("⚠ No organizations found"));
      console.log(
        chalk.dim("Create an organization at https://commet.co first"),
      );
      return;
    }

    spinner.stop();

    let selectedOrg: Organization | undefined;

    if (options.org) {
      selectedOrg = organizations.find(
        (org) => org.slug === options.org || org.id === options.org,
      );
      if (!selectedOrg) {
        console.log(chalk.red(`✗ Organization "${options.org}" not found`));
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
        console.log(chalk.yellow("\n⚠ Link cancelled"));
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

    const gitignoreResult = updateGitignore(".commet/");

    console.log(chalk.green("\n✓ Project linked successfully"));
    console.log(
      chalk.dim(`Organization: ${selectedOrg.name} · ${selectedOrg.mode}`),
    );

    if (gitignoreResult.success) {
      console.log(chalk.green("✓ Updated .gitignore"));
    } else {
      console.log(chalk.yellow("⚠ No .gitignore found"));
      console.log(chalk.dim("Add .commet/ to your .gitignore file"));
    }

    console.log(chalk.dim("\nRun 'commet pull' to generate TypeScript types"));
  });
