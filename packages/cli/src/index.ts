#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import packageJson from "../package.json" with { type: "json" };
import { apiKeyCommand } from "./commands/api-key";
import { createCommand } from "./commands/create";
import { linkCommand } from "./commands/link";
import { listenCommand } from "./commands/listen";
import { loginCommand } from "./commands/login";
import { logoutCommand } from "./commands/logout";
import { orgsCommand } from "./commands/orgs";
import { pullCommand } from "./commands/pull";
import { pushCommand } from "./commands/push";
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "./utils/config";
import { findConfigFile } from "./utils/config-loader";
import { commetColor } from "./utils/prompt-theme";
import {
  installCrashHandler,
  markCommandStart,
  reportCommand,
} from "./utils/telemetry";

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
  $ commet pull --dry-run         See what's configured

For agents and CI:
  $ commet                       JSON capabilities when piped (no args)
  $ commet pull --output agent --yes   Structured output, no prompts
  $ COMMET_API_KEY=sk_... commet push --yes   CI pipeline

Run commet <command> --help for detailed usage and examples.
`,
  );

program.addCommand(createCommand);
program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(linkCommand);
program.addCommand(orgsCommand);
program.addCommand(pushCommand);
program.addCommand(pullCommand);
program.addCommand(listenCommand);
program.addCommand(apiKeyCommand);

program
  .enablePositionalOptions()
  .passThroughOptions()
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  );

program.action((options: { output?: string }) => {
  if (options.output === "agent") {
    printAgentInfo();
  } else {
    printDefaultScreen();
  }
});

program.showSuggestionAfterError();
program.exitOverride();

installCrashHandler();
markCommandStart();

const commandName = process.argv[2] || "(default)";

program.hook("postAction", () => {
  reportCommand(commandName, "success");
});

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
    reportCommand(commandName, "error", code);
    console.error(chalk.red("Error:"), error.message);
  }
  process.exit(1);
}

function printAgentInfo() {
  const authenticated = authExists() || !!process.env.COMMET_API_KEY;
  const projectConfig = projectConfigExists() ? loadProjectConfig() : null;
  const configPath = findConfigFile(process.cwd());

  const setup: string[] = [];
  if (!authenticated) {
    setup.push(
      "Not authenticated. Run 'commet login' (interactive) or set COMMET_API_KEY env var.",
    );
  }
  if (authenticated && !projectConfig && !process.env.COMMET_API_KEY) {
    setup.push(
      "No project linked. Run 'commet link --org <slug>' or 'commet orgs --json' to find organizations.",
    );
  }

  const output = {
    version: packageJson.version,
    authenticated,
    ...(setup.length > 0 ? { setup } : {}),
    project: projectConfig
      ? {
          linked: true,
          orgId: projectConfig.orgId,
          orgName: projectConfig.orgName,
          mode: projectConfig.mode,
        }
      : { linked: false },
    config: {
      exists: configPath !== null,
      path: configPath?.split("/").pop() ?? null,
    },
    mcp: {
      url: "https://commet.co/mcp",
      sandbox: "https://sandbox.commet.co/mcp",
      hint: "For full billing CRUD (plans, features, customers, subscriptions), connect to the MCP server.",
    },
    auth: {
      interactive: "commet login",
      ci: "Set COMMET_API_KEY environment variable",
    },
    commands: {
      pull: {
        description: "Pull remote config and generate commet.config.ts",
        usage: "commet pull --output agent --yes",
        preview: "commet pull --output agent --dry-run",
      },
      push: {
        description: "Push commet.config.ts to remote",
        usage: "commet push --output agent --yes",
        preview: "commet push --output agent --dry-run",
        ci: "COMMET_API_KEY=sk_... commet push --yes",
      },
      orgs: {
        description: "List available organizations",
        usage: "commet orgs --output agent",
      },
      link: {
        description: "Link/switch/unlink organization",
        usage: "commet link --org <slug-or-id>",
        clear: "commet link --clear",
      },
      listen: {
        description:
          "Forward webhook events to local server. Long-running streaming process.",
        usage: "commet listen <url> [--events <types>]",
      },
      create: {
        description: "Scaffold a new Commet app from template",
        usage: "commet create [name] -t <template> --org <slug> -y",
      },
      "api-key": {
        description: "Generate API key for CI",
        usage: "commet api-key --output agent",
      },
      login: {
        description:
          "Authenticate via browser. Requires a human — opens a device-code flow.",
        usage: "commet login",
      },
      logout: {
        description: "Log out of Commet",
        usage: "commet logout",
      },
    },
  };

  console.log(JSON.stringify(output, null, 2));
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

  console.log(dim("\n  Development"));
  console.log(`    ${cmd("listen <url>")}${dim("Forward webhooks locally")}`);

  console.log(dim("\n  Project"));
  console.log(`    ${cmd("link")}${dim("Link / switch organization")}`);
  console.log(`    ${cmd("orgs")}${dim("List organizations")}`);

  console.log(dim("\n  Setup"));
  console.log(`    ${cmd("create")}${dim("Scaffold a new Commet app")}`);
  console.log(`    ${cmd("api-key")}${dim("Generate API key for CI")}`);
  console.log(`    ${cmd("login")}${dim("Authenticate")}`);
  console.log(`    ${cmd("logout")}${dim("Log out")}`);

  console.log(
    dim("\n  commet --help for full reference · COMMET_API_KEY for CI\n"),
  );
}
