import chalk from "chalk";
import { Command } from "commander";
import { authExists, clearAuth } from "../utils/config";

export const logoutCommand = new Command("logout")
  .description(
    "Log out and remove stored credentials from ~/.commet/auth.json.",
  )
  .action(async () => {
    if (!authExists()) {
      console.log(chalk.yellow("⚠ You are not logged in."));
      return;
    }

    clearAuth();
    console.log(chalk.green("✓ Successfully logged out"));
  });
