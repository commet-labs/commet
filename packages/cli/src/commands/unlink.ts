import chalk from "chalk";
import { Command } from "commander";
import { clearProjectConfig, projectConfigExists } from "../utils/config";

export const unlinkCommand = new Command("unlink")
  .description("Unlink this project from Commet")
  .action(async () => {
    if (!projectConfigExists()) {
      console.log(
        chalk.yellow("⚠ This project is not linked to any organization"),
      );
      return;
    }

    clearProjectConfig();
    console.log(chalk.green("✓ Project unlinked successfully"));
    console.log(chalk.dim("✓ Removed .commet/ directory"));
    console.log(
      chalk.dim("\nRun `commet link` to connect to a different organization"),
    );
  });
