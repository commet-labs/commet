import chalk from "chalk";
import { Command } from "commander";
import { authExists } from "../utils/config";
import { performLogin } from "../utils/login-flow";

export const loginCommand = new Command("login")
  .description("Authenticate with Commet")
  .action(async () => {
    if (authExists()) {
      console.log(chalk.yellow("⚠ You are already logged in."));
      console.log(
        chalk.dim(
          "Run `commet logout` first if you want to login with a different account.",
        ),
      );
      return;
    }

    const success = await performLogin();

    if (success) {
      console.log(chalk.green("\n✓ Authentication complete"));
      console.log(
        chalk.dim(
          "\nNext steps:\n  1. Run `commet link` to connect a project\n  2. Run `commet pull` to generate types\n",
        ),
      );
    }
  });
