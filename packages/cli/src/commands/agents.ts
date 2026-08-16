import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import { findCommetPackages, findProjectRoot } from "../utils/agent-project";

export const AGENT_RULES_BEGIN = "<!-- BEGIN:commet-agent-rules -->";
export const AGENT_RULES_END = "<!-- END:commet-agent-rules -->";

interface SetupAgentRulesOptions {
  check?: boolean;
  remove?: boolean;
  dryRun?: boolean;
  output?: string;
  directory?: string;
}

export interface AgentRulesResult {
  status: "created" | "updated" | "unchanged" | "removed" | "missing";
  path: string;
  packages: string[];
}

export function renderAgentRules(
  packages: Array<{ name: string; documentation: string }>,
): string {
  const lines = [
    AGENT_RULES_BEGIN,
    "",
    "# Commet",
    "",
    "Before changing a Commet integration, read the version-matched documentation installed in this project:",
    "",
    ...packages.map(
      (packageInfo) =>
        `- \`${packageInfo.documentation}\` for \`${packageInfo.name}\``,
    ),
    "",
    "Run `commet doctor --output agent` before making integration changes. The command is local and read-only.",
    "",
    AGENT_RULES_END,
  ];
  return lines.join("\n");
}

export function updateManagedAgentRules(
  existingContent: string,
  managedBlock: string,
): { content: string; status: "created" | "updated" | "unchanged" } {
  const existingBlock = findManagedAgentRules(existingContent);
  if (!existingBlock) {
    const prefix =
      existingContent.length > 0 ? `${existingContent.trimEnd()}\n\n` : "";
    return { content: `${prefix}${managedBlock}\n`, status: "created" };
  }
  const content = `${existingContent.slice(0, existingBlock.begin)}${managedBlock}${existingContent.slice(existingBlock.end)}`;
  return {
    content,
    status: content === existingContent ? "unchanged" : "updated",
  };
}

export function removeManagedAgentRules(existingContent: string): string {
  const existingBlock = findManagedAgentRules(existingContent);
  if (!existingBlock) return existingContent;
  const before = existingContent.slice(0, existingBlock.begin).trimEnd();
  const after = existingContent.slice(existingBlock.end).trimStart();
  if (before && after) return `${before}\n\n${after}`;
  if (before) return `${before}\n`;
  return after;
}

function findManagedAgentRules(
  content: string,
): { begin: number; end: number } | undefined {
  const begin = content.indexOf(AGENT_RULES_BEGIN);
  const end = content.indexOf(AGENT_RULES_END);
  if (begin === -1 && end === -1) return undefined;
  if (
    begin === -1 ||
    end < begin ||
    content.indexOf(AGENT_RULES_BEGIN, begin + AGENT_RULES_BEGIN.length) !==
      -1 ||
    content.indexOf(AGENT_RULES_END, end + AGENT_RULES_END.length) !== -1
  ) {
    throw new Error("AGENTS.md contains an invalid Commet managed block");
  }
  return { begin, end: end + AGENT_RULES_END.length };
}

export function setupAgentRules(
  startDirectory: string,
  options: Pick<SetupAgentRulesOptions, "check" | "remove" | "dryRun"> = {},
): AgentRulesResult {
  const projectRoot = findProjectRoot(startDirectory);
  const agentsPath = join(projectRoot, "AGENTS.md");
  const existingContent = existsSync(agentsPath)
    ? readFileSync(agentsPath, "utf8")
    : "";
  const packages = findCommetPackages(projectRoot);

  if (options.remove) {
    const content = removeManagedAgentRules(existingContent);
    const status = content === existingContent ? "missing" : "removed";
    if (!options.dryRun && status === "removed")
      writeFileSync(agentsPath, content);
    return {
      status,
      path: agentsPath,
      packages: packages.map(({ name }) => name),
    };
  }

  if (packages.length === 0) {
    throw new Error(`No Commet packages found in ${projectRoot}`);
  }
  const packageDocs = packages.map((packageInfo) => ({
    name: packageInfo.name,
    documentation: packageInfo.documentationPath
      ? relative(projectRoot, packageInfo.documentationPath)
      : packageInfo.name === "@commet/node"
        ? "node_modules/@commet/node/docs/README.md"
        : `node_modules/${packageInfo.name}/README.md`,
  }));

  const managedBlock = renderAgentRules(packageDocs);
  const update = updateManagedAgentRules(existingContent, managedBlock);
  if (!(options.check || options.dryRun) && update.status !== "unchanged") {
    writeFileSync(agentsPath, update.content);
  }
  return {
    status: update.status,
    path: agentsPath,
    packages: packages.map(({ name }) => name),
  };
}

const setupCommand = new Command("setup")
  .description("Install or update Commet instructions in AGENTS.md")
  .option("--check", "Check whether the managed instructions are current")
  .option("--remove", "Remove only the Commet managed instructions")
  .option("--dry-run", "Show the result without writing files")
  .option("--directory <path>", "Project directory", process.cwd())
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  )
  .action((options: SetupAgentRulesOptions) => {
    if (options.check && options.remove) {
      throw new Error("--check and --remove cannot be used together");
    }
    const result = setupAgentRules(
      resolve(options.directory ?? process.cwd()),
      options,
    );
    if (options.output === "agent") {
      console.log(JSON.stringify({ schemaVersion: 1, ...result }));
    } else {
      const path = relative(process.cwd(), result.path) || "AGENTS.md";
      if (result.status === "unchanged") {
        console.log(chalk.green(`✓ ${path} is current`));
      } else if (result.status === "removed") {
        console.log(chalk.green(`✓ Removed Commet instructions from ${path}`));
      } else if (options.check) {
        console.log(chalk.yellow(`⚠ ${path} needs Commet instructions`));
      } else {
        const verb = options.dryRun ? "Would update" : "Updated";
        console.log(chalk.green(`✓ ${verb} ${path}`));
      }
    }
    if (options.check && result.status !== "unchanged") process.exitCode = 1;
  });

export const agentsCommand = new Command("agents")
  .description("Manage Commet instructions for coding agents")
  .addCommand(setupCommand);
