#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import packageJson from "../package.json" with { type: "json" };
import { agentInfoCommand } from "./commands/agent-info";
import { createCommand } from "./commands/create";
import { linkCommand } from "./commands/link";
import { listCommand } from "./commands/list";
import { listenCommand } from "./commands/listen";
import { loginCommand } from "./commands/login";
import { logoutCommand } from "./commands/logout";
import { orgsCommand } from "./commands/orgs";
import { pullCommand } from "./commands/pull";
import { pushCommand } from "./commands/push";
import { switchCommand } from "./commands/switch";
import { unlinkCommand } from "./commands/unlink";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "./utils/config";
import { findConfigFile } from "./utils/config-loader";
import { commetColor } from "./utils/prompt-theme";

const program = new Command();

program
  .name("commet")
  .description(
    "Commet CLI — billing infrastructure as code.\nManage features, plans, and billing config from the command line.",
  )
  .version(packageJson.version)
  .addHelpText(
    "after",
    `
Workflow:
  $ commet pull                  Sync remote → commet.config.ts
  $ commet push                  Push local changes → remote
  $ commet list features         See what's configured

For agents and CI:
  $ commet agent-info            JSON with status + every command's usage
  $ commet pull --json --yes     Structured output, no prompts
  $ commet orgs --json           List orgs as JSON
  $ commet link --org <slug>     Link without interactive selection

Run commet <command> --help for detailed usage and examples.
`,
  );

program.addCommand(createCommand);
program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(linkCommand);
program.addCommand(unlinkCommand);
program.addCommand(switchCommand);
program.addCommand(agentInfoCommand);
program.addCommand(orgsCommand);
program.addCommand(pushCommand);
program.addCommand(pullCommand);
program.addCommand(listCommand);
program.addCommand(listenCommand);

program.showSuggestionAfterError();
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error) {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    if (
      code === "commander.version" ||
      code === "commander.help" ||
      code === "commander.helpDisplayed"
    ) {
      process.exit(0);
    }
    console.error(chalk.red("Error:"), error.message);
  }
  process.exit(1);
}

if (!process.argv.slice(2).length) {
  printDefaultScreen();
}

function printDefaultScreen() {
  const version = chalk.dim(`v${packageJson.version}`);
  console.log(`\n  ${commetColor.bold("Commet")} ${version}`);
  console.log(chalk.dim("  Billing infrastructure as code\n"));

  const authenticated = authExists();
  const projectConfig = projectConfigExists() ? loadProjectConfig() : null;
  const configFile = findConfigFile(process.cwd());

  if (authenticated) {
    console.log(chalk.green("  ✓ Authenticated"));
  } else {
    console.log(
      `  ${chalk.yellow("⚠")} Not logged in ${chalk.dim("→ commet login")}`,
    );
  }

  if (projectConfig) {
    console.log(
      chalk.green(
        `  ✓ ${projectConfig.orgName} ${chalk.dim(`(${projectConfig.mode})`)}`,
      ),
    );
    console.log(chalk.dim(`    ${projectConfig.orgId}`));
  } else if (authenticated) {
    console.log(
      `  ${chalk.yellow("⚠")} No project linked ${chalk.dim("→ commet link")}`,
    );
  }

  if (configFile) {
    const fileName = configFile.split("/").pop();
    console.log(chalk.green(`  ✓ ${fileName}`));
  } else if (projectConfig) {
    console.log(
      `  ${chalk.yellow("⚠")} No config file ${chalk.dim("→ commet pull")}`,
    );
  }

  const cmd = (name: string) => commetColor(name.padEnd(22));
  const dim = chalk.dim;

  console.log(dim("\n  Config"));
  console.log(`    ${cmd("pull")}${dim("Sync remote → commet.config.ts")}`);
  console.log(`    ${cmd("push")}${dim("Sync commet.config.ts → remote")}`);
  console.log(`    ${cmd("list <type>")}${dim("List features, plans, or seats")}`);

  console.log(dim("\n  Development"));
  console.log(`    ${cmd("listen <url>")}${dim("Forward webhooks locally")}`);

  console.log(dim("\n  Project"));
  console.log(`    ${cmd("link")}${dim("Link to an organization")}`);
  console.log(`    ${cmd("switch")}${dim("Switch organization")}`);
  console.log(`    ${cmd("orgs")}${dim("List organizations")}`);

  console.log(dim("\n  Setup"));
  console.log(`    ${cmd("create")}${dim("Scaffold a new Commet app")}`);
  console.log(`    ${cmd("login")}${dim("Authenticate")}`);
  console.log(`    ${cmd("logout")}${dim("Log out")}`);

  console.log(
    dim("\n  commet --help for full reference · commet agent-info for agents/CI\n"),
  );
}
