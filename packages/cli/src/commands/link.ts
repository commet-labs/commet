import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import {
  authExists,
  clearProjectConfig,
  loadProjectConfig,
  projectConfigExists,
  saveProjectConfig,
} from "../utils/config";
import { updateGitignore } from "../utils/gitignore-updater";
import { exitWithError, isAgentMode } from "../utils/output";
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
  clear?: boolean;
  output?: string;
}

export const linkCommand = new Command("link")
  .description(
    "Link this project to a Commet organization. Re-run to switch orgs.",
  )
  .option(
    "--org <slug-or-id>",
    "Organization slug or ID — skips interactive selection",
  )
  .option("--clear", "Unlink project from its organization")
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet link                  Interactive — choose from a list
  $ commet link --org acme       Non-interactive — match by slug or ID
  $ commet link --org other      Re-run to switch organization
  $ commet link --clear          Unlink project
`,
  )
  .action(async (options: LinkOptions) => {
    const agentMode = isAgentMode(options);

    if (options.clear) {
      if (!projectConfigExists()) {
        if (agentMode) {
          console.log(JSON.stringify({ success: true, message: "Not linked" }));
        } else {
          console.log(
            chalk.yellow("⚠ This project is not linked to any organization"),
          );
        }
        return;
      }

      clearProjectConfig();

      if (agentMode) {
        console.log(JSON.stringify({ success: true, action: "unlinked" }));
      } else {
        console.log(chalk.green("✓ Project unlinked"));
      }
      return;
    }

    if (!authExists()) {
      exitWithError({
        code: "auth_required",
        message: "Not authenticated",
        action: "commet login",
      });
    }

    const currentConfig = projectConfigExists() ? loadProjectConfig() : null;
    const spinner = agentMode ? null : ora("Fetching organizations...").start();

    const result = await apiRequest<OrganizationsResponse>(
      `${BASE_URL}/api/cli/organizations`,
    );

    if (result.error || !result.data) {
      if (agentMode) {
        console.log(JSON.stringify({ error: result.error }));
      } else {
        spinner?.fail("Failed to fetch organizations");
        console.error(chalk.red("Error:"), result.error?.message);
      }
      process.exit(1);
    }

    const { organizations } = result.data;

    if (organizations.length === 0) {
      spinner?.stop();
      if (agentMode) {
        console.log(
          JSON.stringify({
            error: {
              code: "no_organizations",
              message: "No organizations found",
            },
          }),
        );
      } else {
        console.log(chalk.yellow("⚠ No organizations found"));
        console.log(
          chalk.dim("Create an organization at https://commet.co first"),
        );
      }
      return;
    }

    spinner?.stop();

    let selectedOrg: Organization | undefined;

    if (options.org) {
      selectedOrg = organizations.find(
        (org) => org.slug === options.org || org.id === options.org,
      );
      if (!selectedOrg) {
        if (agentMode) {
          console.log(
            JSON.stringify({
              error: {
                code: "org_not_found",
                message: `Organization "${options.org}" not found`,
              },
              organizations: organizations.map((o) => ({
                slug: o.slug,
                mode: o.mode,
              })),
            }),
          );
        } else {
          console.log(chalk.red(`✗ Organization "${options.org}" not found`));
          console.log(chalk.dim("\nAvailable organizations:"));
          for (const org of organizations) {
            console.log(chalk.dim(`  ${org.slug} (${org.mode})`));
          }
        }
        process.exit(1);
      }
    } else {
      let orgId: string;
      try {
        orgId = await select({
          message: currentConfig
            ? `Switch from ${currentConfig.orgName}? Select new org:`
            : "Select organization:",
          choices: organizations.map((org) => {
            const isCurrent = currentConfig?.orgId === org.id;
            const label = isCurrent
              ? `${org.name} ${chalk.dim(`(${org.slug}) · ${org.mode}`)} ${chalk.green("← current")}`
              : `${org.name} ${chalk.dim(`(${org.slug}) · ${org.mode}`)}`;
            return { name: label, value: org.id };
          }),
          theme: promptTheme,
        });
      } catch (_error) {
        console.log(chalk.yellow("\n⚠ Cancelled"));
        return;
      }

      selectedOrg = organizations.find((org) => org.id === orgId);
      if (!selectedOrg) {
        exitWithError({
          code: "org_not_found",
          message: "Organization not found",
        });
      }
    }

    if (currentConfig?.orgId === selectedOrg.id) {
      if (agentMode) {
        console.log(
          JSON.stringify({
            success: true,
            action: "unchanged",
            organization: {
              id: selectedOrg.id,
              name: selectedOrg.name,
              slug: selectedOrg.slug,
              mode: selectedOrg.mode,
            },
          }),
        );
      } else {
        console.log(
          chalk.green(
            `✓ Already linked to ${selectedOrg.name} (${selectedOrg.mode})`,
          ),
        );
      }
      return;
    }

    const action = currentConfig ? "switched" : "linked";

    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      mode: selectedOrg.mode,
    });

    const gitignoreResult = updateGitignore(".commet/");

    if (agentMode) {
      console.log(
        JSON.stringify({
          success: true,
          action,
          organization: {
            id: selectedOrg.id,
            name: selectedOrg.name,
            slug: selectedOrg.slug,
            mode: selectedOrg.mode,
          },
        }),
      );
    } else {
      const verb = action === "switched" ? "Switched to" : "Linked to";
      console.log(
        chalk.green(`\n✓ ${verb} ${selectedOrg.name} (${selectedOrg.mode})`),
      );
      if (gitignoreResult.success && action === "linked") {
        console.log(chalk.green("✓ Updated .gitignore"));
      }
      console.log(chalk.dim("\nRun `commet pull` to sync your config"));
    }
  });
