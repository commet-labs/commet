import { CommetAPIError, CommetValidationError } from "@commet/node";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { isAgentMode } from "../../utils/output";
import { createSdkClient } from "../../utils/sdk";

export interface ParamDef {
  flag: string;
  description: string;
  required?: boolean;
  parse?: (value: string) => unknown;
  sdkKey: string;
}

export interface ActionDef {
  method: string;
  description: string;
  params: ParamDef[];
  buildParams?: (options: Record<string, string>) => unknown;
}

export interface ResourceDef {
  name: string;
  description: string;
  sdkProperty: string;
  actions: Record<string, ActionDef>;
}

export function createResourceCommand(def: ResourceDef): Command {
  const command = new Command(def.name).description(def.description);

  for (const [actionName, actionDef] of Object.entries(def.actions)) {
    const subcommand = new Command(actionName)
      .description(actionDef.description)
      .option(
        "--output <format>",
        "Output format: human (default) or agent",
        "human",
      );

    for (const param of actionDef.params) {
      if (param.required) {
        subcommand.requiredOption(param.flag, param.description);
      } else {
        subcommand.option(param.flag, param.description);
      }
    }

    subcommand.action(async (options: Record<string, string>) => {
      const agentMode = isAgentMode(options);
      const spinner = agentMode
        ? null
        : ora(`Running ${def.name} ${actionName}...`).start();

      try {
        const client = createSdkClient();
        const resource = client[
          def.sdkProperty as keyof typeof client
        ] as unknown as Record<string, (params: unknown) => Promise<unknown>>;
        const method = resource[actionDef.method];

        let params: unknown;
        if (actionDef.buildParams) {
          params = actionDef.buildParams(options);
        } else {
          const built: Record<string, unknown> = {};
          for (const paramDef of actionDef.params) {
            const rawValue = options[paramDef.sdkKey];
            if (rawValue === undefined) {
              continue;
            }
            built[paramDef.sdkKey] = paramDef.parse
              ? paramDef.parse(rawValue)
              : rawValue;
          }
          params = built;
        }

        const result = await method.call(resource, params);

        spinner?.succeed(`${def.name} ${actionName}`);

        if (agentMode) {
          console.log(JSON.stringify(result));
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
      } catch (error) {
        if (error instanceof CommetValidationError) {
          spinner?.fail(`Validation error`);
          if (agentMode) {
            console.log(
              JSON.stringify({
                error: {
                  code: "validation_error",
                  message: error.message,
                  validationErrors: error.validationErrors,
                },
              }),
            );
          } else {
            console.error(chalk.red(`✗ ${error.message}`));
            for (const [field, messages] of Object.entries(
              error.validationErrors,
            )) {
              for (const msg of messages) {
                console.error(chalk.red(`  ${field}: ${msg}`));
              }
            }
          }
          process.exit(1);
        }

        if (error instanceof CommetAPIError) {
          spinner?.fail(`API error`);
          if (agentMode) {
            console.log(
              JSON.stringify({
                error: {
                  code: error.code ?? `http_${error.statusCode}`,
                  message: error.message,
                  statusCode: error.statusCode,
                },
              }),
            );
          } else {
            console.error(
              chalk.red(`✗ ${error.message} (${error.statusCode})`),
            );
          }
          process.exit(1);
        }

        spinner?.fail(`Unexpected error`);
        const message = error instanceof Error ? error.message : String(error);
        if (agentMode) {
          console.log(JSON.stringify({ error: { code: "unknown", message } }));
        } else {
          console.error(chalk.red(`✗ ${message}`));
        }
        process.exit(1);
      }
    });

    command.addCommand(subcommand);
  }

  return command;
}

export function generateResourceSchema(
  defs: ResourceDef[],
): Record<string, unknown> {
  const resources: Record<string, unknown> = {};

  for (const def of defs) {
    const actions: Record<string, unknown> = {};

    for (const [actionName, actionDef] of Object.entries(def.actions)) {
      const params: Record<string, unknown> = {};
      for (const param of actionDef.params) {
        params[param.sdkKey] = {
          flag: param.flag,
          description: param.description,
          required: param.required ?? false,
        };
      }

      actions[actionName] = {
        usage: `commet ${def.name} ${actionName}`,
        description: actionDef.description,
        params,
      };
    }

    resources[def.name] = {
      description: def.description,
      actions,
    };
  }

  return resources;
}
