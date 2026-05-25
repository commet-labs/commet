import chalk from "chalk";
import { Command } from "commander";
import { authExists, clearAuth } from "../utils/config";
import { isAgentMode } from "../utils/output";

export const logoutCommand = new Command("logout")
  .description(
    "Log out and remove stored credentials from ~/.commet/auth.json.",
  )
  .action(async () => {
    if (process.env.COMMET_API_KEY) {
      if (isAgentMode()) {
        console.log(
          JSON.stringify({
            success: true,
            message: "Using COMMET_API_KEY — no session to clear",
          }),
        );
      } else {
        console.log(
          chalk.green("✓ Using COMMET_API_KEY — no session to clear"),
        );
      }
      return;
    }

    if (!authExists()) {
      console.log(chalk.yellow("⚠ You are not logged in."));
      return;
    }

    clearAuth();
    console.log(chalk.green("✓ Successfully logged out"));
  });
