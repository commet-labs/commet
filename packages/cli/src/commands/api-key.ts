import chalk from "chalk";
import { Command } from "commander";
import { isAgentMode } from "../utils/output";

export const apiKeyCommand = new Command("api-key")
  .description("Deprecated — use 'commet api-keys create' instead")
  .allowUnknownOption()
  .allowExcessArguments()
  .helpOption(false)
  .action((options: Record<string, string>) => {
    if (isAgentMode(options)) {
      console.log(
        JSON.stringify({
          deprecated: true,
          replacement: "commet api-keys create",
          message:
            "This command has been removed. Use 'commet api-keys create' instead.",
        }),
      );
    } else {
      console.log(chalk.yellow("\n  ⚠ 'commet api-key' has been removed.\n"));
      console.log(
        `  Use ${chalk.bold("commet api-keys create --name <name>")} instead.\n`,
      );
      console.log(
        `  Run ${chalk.dim("commet api-keys --help")} for all options.\n`,
      );
    }
    process.exit(0);
  });
