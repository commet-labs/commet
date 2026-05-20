import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { apiRequest, BASE_URL } from "../utils/api";
import { authExists, loadProjectConfig } from "../utils/config";

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

interface OrgsOptions {
  json?: boolean;
}

export const orgsCommand = new Command("orgs")
  .description(
    "List all organizations you have access to. Shows name, slug, mode (live/sandbox), and which one is currently linked.",
  )
  .option("--json", "Output as JSON array")
  .addHelpText(
    "after",
    `
Examples:
  $ commet orgs                  Show orgs with current selection marked
  $ commet orgs --json           JSON array for agent/CI use

The slug shown here is what you pass to 'commet link --org <slug>'.
`,
  )
  .action(async (options: OrgsOptions) => {
    const jsonMode = options.json;

    if (!authExists()) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: "Not authenticated" }));
      } else {
        console.log(chalk.red("✗ Not authenticated"));
        console.log(chalk.dim("Run `commet login` first"));
      }
      process.exit(1);
    }

    const spinner = jsonMode ? null : ora("Fetching organizations...").start();

    const result = await apiRequest<OrganizationsResponse>(
      `${BASE_URL}/api/cli/organizations`,
    );

    if (result.error || !result.data) {
      if (jsonMode) {
        console.log(JSON.stringify({ error: result.error }));
      } else {
        spinner?.fail("Failed to fetch organizations");
        console.error(chalk.red("Error:"), result.error);
      }
      process.exit(1);
    }

    spinner?.stop();

    const { organizations } = result.data;

    if (jsonMode) {
      console.log(JSON.stringify(organizations));
      return;
    }

    if (organizations.length === 0) {
      console.log(chalk.yellow("⚠ No organizations found"));
      console.log(
        chalk.dim("Create an organization at https://commet.co first"),
      );
      return;
    }

    const currentProject = loadProjectConfig();

    console.log(chalk.bold(`\n  Organizations (${organizations.length})\n`));

    for (const org of organizations) {
      const isCurrent = currentProject?.orgId === org.id;
      const marker = isCurrent ? chalk.green("●") : chalk.dim("○");
      const mode =
        org.mode === "live" ? chalk.green(org.mode) : chalk.yellow(org.mode);
      console.log(
        `  ${marker} ${org.name} ${chalk.dim(`(${org.slug})`)} ${mode}`,
      );
    }

    console.log("");
  });
