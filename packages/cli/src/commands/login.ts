import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { authExists } from "../utils/config";
import { performLogin } from "../utils/login-flow";
import { promptTheme } from "../utils/prompt-theme";

export const loginCommand = new Command("login")
  .description("Authenticate with Commet")
  .action(async () => {
    if (authExists()) {
      console.log(chalk.yellow("\u26A0 You are already logged in."));
      console.log(
        chalk.dim(
          "Run `commet logout` first if you want to login with a different account.",
        ),
      );
      return;
    }

    let environment: "sandbox" | "production";
    try {
      environment = await select<"sandbox" | "production">({
        message: "Select environment to login:",
        choices: [
          {
            name: `Sandbox ${chalk.dim("(Development)")}`,
            value: "sandbox",
          },
          {
            name: "Production",
            value: "production",
          },
        ],
        default: "sandbox",
        theme: promptTheme,
      });
    } catch {
      console.log(chalk.yellow("\n\u26A0 Login cancelled"));
      return;
    }

    const success = await performLogin(environment);

    if (success) {
      console.log(chalk.green("\n\u2713 Authentication complete"));
      console.log(
        chalk.dim(
          "\nNext steps:\n  1. Run `commet link` to connect a project\n  2. Run `commet pull` to generate types\n",
        ),
      );
    }
  });
