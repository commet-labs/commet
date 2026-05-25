import chalk from "chalk";
import { authExists, loadProjectConfig } from "./config";
import { reportCommand } from "./telemetry";

export function isAgentMode(options?: { output?: string }): boolean {
  if (options?.output === "agent") return true;
  const idx = process.argv.indexOf("--output");
  return idx !== -1 && process.argv[idx + 1] === "agent";
}

export interface CliError {
  code: string;
  message: string;
  action?: string;
}

export function exitWithError(error: CliError): never {
  const command = process.argv[2] || "(default)";
  reportCommand(command, "error", error.code);

  if (isAgentMode()) {
    console.log(JSON.stringify({ error }));
  } else {
    console.log(chalk.red(`✗ ${error.message}`));
    if (error.action) {
      console.log(chalk.dim(`Run \`${error.action}\``));
    }
  }
  process.exit(1);
}

export function requireAuth(): void {
  if (process.env.COMMET_API_KEY) return;
  if (!authExists()) {
    exitWithError({
      code: "auth_required",
      message: "Not authenticated",
      action: "commet login",
    });
  }
}

export function requireOrgContext(): { orgId: string } {
  if (process.env.COMMET_API_KEY) {
    return { orgId: "__from_api_key__" };
  }

  requireAuth();

  const projectConfig = loadProjectConfig();
  if (!projectConfig) {
    exitWithError({
      code: "project_not_linked",
      message: "No organization linked",
      action: "commet link",
    });
  }

  return { orgId: projectConfig.orgId };
}
