import { Command } from "commander";
import packageJson from "../../package.json" with { type: "json" };
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from "../utils/config";
import { findConfigFile } from "../utils/config-loader";

export const agentInfoCommand = new Command("agent-info")
  .description(
    "Print project status and CLI capabilities as JSON. Designed for AI agents and CI pipelines — run this first to discover what commands are available and how to call them non-interactively.",
  )
  .action(() => {
    const authenticated = authExists();
    const projectConfig = projectConfigExists() ? loadProjectConfig() : null;
    const configPath = findConfigFile(process.cwd());

    const setup: string[] = [];
    if (!authenticated) {
      setup.push(
        "Not authenticated. A human must run 'commet login' in a terminal with browser access — this is the only interactive step.",
      );
    }
    if (authenticated && !projectConfig) {
      setup.push(
        "No project linked. Run 'commet link --org <slug>' or 'commet orgs --json' to find available organizations.",
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
      commands: {
        pull: {
          description: "Pull remote config and generate commet.config.ts",
          usage: "commet pull --json --yes",
          preview: "commet pull --json --dry-run",
        },
        push: {
          description: "Push commet.config.ts to remote",
          usage: "commet push --json --yes",
          preview: "commet push --json --dry-run",
        },
        list: {
          description: "List resources from remote",
          usage: "commet list <features|plans|seats> --json",
        },
        orgs: {
          description: "List available organizations",
          usage: "commet orgs --json",
        },
        link: {
          description: "Link project to an organization",
          usage: "commet link --org <slug-or-id>",
        },
        switch: {
          description: "Switch to a different organization",
          usage: "commet switch --org <slug-or-id>",
        },
        listen: {
          description:
            "Forward webhook events to local server. Long-running streaming process — run in background.",
          usage: "commet listen <url> [--events <types>]",
        },
        create: {
          description: "Scaffold a new Commet app from template",
          usage: "commet create [name] -t <template> --org <slug> -y",
        },
        unlink: {
          description: "Unlink project from organization",
          usage: "commet unlink",
        },
        login: {
          description:
            "Authenticate via browser. Requires a human — opens a device-code flow that must be confirmed in a browser.",
          usage: "commet login",
        },
        logout: {
          description: "Log out of Commet",
          usage: "commet logout",
        },
      },
    };

    console.log(JSON.stringify(output, null, 2));
  });
