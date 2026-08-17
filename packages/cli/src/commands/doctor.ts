import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { parse } from "@babel/parser";
import chalk from "chalk";
import { Command } from "commander";
import { satisfies, valid } from "semver";
import {
  findCommetPackages,
  findProjectRoot,
  type InstalledCommetPackage,
} from "../utils/agent-project";
import { setupAgentRules } from "./agents";

export interface DoctorCheck {
  code: string;
  status: "pass" | "warning" | "fail";
  message: string;
  evidence?: Record<string, string>;
  impact?: string;
  action?: string;
}

export interface DoctorReport {
  schemaVersion: 1;
  status: "ok" | "warnings" | "issues";
  projectRoot: string;
  apiVersion?: string;
  checks: DoctorCheck[];
}

interface DoctorOptions {
  directory?: string;
  output?: string;
}

export function evaluatePackageCompatibility(
  packages: InstalledCommetPackage[],
): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  const nodePackage = packages.find(
    (packageInfo) => packageInfo.name === "@commet/node",
  );
  const nodeVersion = nodePackage?.manifest?.version;

  for (const packageInfo of packages) {
    const manifest = packageInfo.manifest;
    const version = manifest?.version;
    if (!(manifest && version)) {
      checks.push({
        code: "PACKAGE_NOT_INSTALLED",
        status: "fail",
        message: `${packageInfo.name} is declared but not installed`,
        evidence: packageInfo.declaredRange
          ? { declaredRange: packageInfo.declaredRange }
          : undefined,
        impact:
          "The installed SDK surface and its documentation cannot be verified",
        action: "Install project dependencies",
      });
      continue;
    }
    checks.push({
      code: "PACKAGE_INSTALLED",
      status: "pass",
      message: `${packageInfo.name} ${version} is installed`,
      evidence: { package: packageInfo.name, version },
    });

    if (!packageInfo.documentationPath) {
      checks.push({
        code: "PACKAGE_DOCUMENTATION_MISSING",
        status: "fail",
        message: `${packageInfo.name} does not contain its installed documentation`,
        impact:
          "Agents may implement against documentation that does not match the installed package",
        action: `Upgrade ${packageInfo.name} to a release that ships agent documentation`,
      });
    } else {
      checks.push({
        code: "PACKAGE_DOCUMENTATION_AVAILABLE",
        status: "pass",
        message: `${packageInfo.name} documentation is installed`,
        evidence: { path: packageInfo.documentationPath },
      });
    }

    if (packageInfo.name === "@commet/node") continue;
    const nodeRange = manifest.peerDependencies["@commet/node"];
    if (!nodeRange) continue;
    if (!nodeVersion) {
      checks.push({
        code: "NODE_SDK_REQUIRED",
        status: "fail",
        message: `${packageInfo.name} requires @commet/node`,
        evidence: { supportedRange: normalizeWorkspaceRange(nodeRange) },
        impact: "The integration cannot load its required Commet SDK peer",
        action: "Install a supported @commet/node version",
      });
      continue;
    }
    const normalizedRange = normalizeWorkspaceRange(nodeRange);
    if (!(valid(nodeVersion) && satisfies(nodeVersion, normalizedRange))) {
      checks.push({
        code: "PACKAGE_VERSION_MISMATCH",
        status: "fail",
        message: `${packageInfo.name} ${version} does not support @commet/node ${nodeVersion}`,
        evidence: {
          installedNodeVersion: nodeVersion,
          supportedNodeRange: normalizedRange,
        },
        impact:
          "The integration may call SDK APIs outside its supported contract",
        action: `Install an @commet/node version in ${normalizedRange} or upgrade ${packageInfo.name}`,
      });
    } else {
      checks.push({
        code: "PACKAGE_VERSION_COMPATIBLE",
        status: "pass",
        message: `${packageInfo.name} supports @commet/node ${nodeVersion}`,
        evidence: { supportedNodeRange: normalizedRange },
      });
    }
  }

  return checks;
}

export function runDoctor(startDirectory: string): DoctorReport {
  const projectRoot = findProjectRoot(startDirectory);
  const packages = findCommetPackages(projectRoot);
  const checks = evaluatePackageCompatibility(packages);
  const sourceConfiguration = inspectSourceConfiguration(projectRoot);

  if (packages.length === 0) {
    checks.push({
      code: "COMMET_PACKAGES_NOT_FOUND",
      status: "fail",
      message: "No Commet packages are declared or installed in this project",
      impact:
        "Commet integration diagnostics cannot be resolved for this project",
      action: "Install @commet/node or a Commet integration package",
    });
  }

  for (const packageName of sourceConfiguration.integrationPackages) {
    checks.push({
      code: "INTEGRATION_CONFIGURATION_DETECTED",
      status: "pass",
      message: `${packageName} is referenced by project source`,
      evidence: {
        package: packageName,
        path:
          sourceConfiguration.integrationPaths.get(packageName) ?? projectRoot,
      },
    });
  }

  for (const variableName of sourceConfiguration.environmentVariables) {
    const source = findEnvironmentVariableSource(projectRoot, variableName);
    checks.push(
      source
        ? {
            code: "ENVIRONMENT_VARIABLE_AVAILABLE",
            status: "pass",
            message: `${variableName} is available locally`,
            evidence: { variable: variableName, source },
          }
        : {
            code: "ENVIRONMENT_VARIABLE_MISSING",
            status: "fail",
            message: `${variableName} is referenced by project source but is not available locally`,
            evidence: { variable: variableName },
            impact:
              "The detected Commet integration cannot initialize this configuration locally",
            action: `Set ${variableName} in the process environment or an active .env file`,
          },
    );
  }

  if (sourceConfiguration.scanFailures.length > 0) {
    checks.push({
      code: "SOURCE_CONFIGURATION_SCAN_INCOMPLETE",
      status: "warning",
      message: `Could not parse ${sourceConfiguration.scanFailures.length} source file${sourceConfiguration.scanFailures.length === 1 ? "" : "s"}`,
      evidence: { paths: sourceConfiguration.scanFailures.join(", ") },
      impact:
        "Environment-variable and integration checks may be incomplete for these files",
      action: "Fix their syntax errors and run commet doctor again",
    });
  }

  if (packages.length > 0) {
    const agentsPath = join(projectRoot, "AGENTS.md");
    try {
      const agentRules = setupAgentRules(projectRoot, {
        check: true,
        dryRun: true,
      });
      checks.push(
        agentRules.status === "unchanged"
          ? {
              code: "AGENT_RULES_CURRENT",
              status: "pass",
              message: "AGENTS.md contains current Commet instructions",
              evidence: { path: agentsPath },
            }
          : {
              code: "AGENT_RULES_STALE",
              status: "warning",
              message: "AGENTS.md does not match the installed Commet packages",
              evidence: { path: agentsPath },
              impact:
                "Coding agents may miss the documentation that matches the installed packages",
              action: "Run commet agents setup",
            },
      );
    } catch (error) {
      checks.push({
        code: "AGENT_RULES_INVALID",
        status: "fail",
        message:
          error instanceof Error
            ? error.message
            : "AGENTS.md contains invalid Commet instructions",
        evidence: { path: agentsPath },
        impact:
          "Commet cannot safely update agent instructions without risking project-owned content",
        action: "Repair or remove the incomplete Commet managed block",
      });
    }
  }

  const apiVersion = readInstalledApiVersion(packages);
  if (apiVersion) {
    checks.push({
      code: "API_VERSION_RESOLVED",
      status: "pass",
      message: `Installed API documentation targets ${apiVersion}`,
      evidence: { apiVersion },
    });
  } else if (
    packages.some(
      (packageInfo) =>
        packageInfo.name === "@commet/node" && packageInfo.manifest,
    )
  ) {
    checks.push({
      code: "API_VERSION_UNRESOLVED",
      status: "fail",
      message:
        "The installed @commet/node documentation has no valid API version",
      impact:
        "Agents cannot determine which API contract matches the installed SDK",
      action: "Reinstall or upgrade @commet/node",
    });
  }

  const projectConfigPath = join(projectRoot, ".commet", "config.json");
  if (existsSync(projectConfigPath)) {
    const context = readProjectContext(projectConfigPath);
    checks.push(
      context
        ? {
            code: "PROJECT_CONTEXT_VALID",
            status: "pass",
            message: `Project context is ${context.organizationName} · ${context.mode}`,
            evidence: {
              organizationId: context.organizationId,
              organizationName: context.organizationName,
              mode: context.mode,
              path: projectConfigPath,
            },
          }
        : {
            code: "PROJECT_CONTEXT_INVALID",
            status: "fail",
            message:
              ".commet/config.json does not contain a valid organization and mode",
            evidence: { path: projectConfigPath },
            impact:
              "The CLI cannot determine whether operations target sandbox or live mode",
            action: "Run commet link again",
          },
    );
  }

  const status = checks.some((check) => check.status === "fail")
    ? "issues"
    : checks.some((check) => check.status === "warning")
      ? "warnings"
      : "ok";
  return { schemaVersion: 1, status, projectRoot, apiVersion, checks };
}

function normalizeWorkspaceRange(range: string): string {
  return range.startsWith("workspace:")
    ? range.slice("workspace:".length)
    : range;
}

const SOURCE_EXTENSIONS = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);
const IGNORED_SOURCE_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "test",
  "tests",
  "__tests__",
]);
const REQUIRED_COMMET_ENVIRONMENT_VARIABLES = new Set([
  "COMMET_API_KEY",
  "COMMET_WEBHOOK_SECRET",
]);
const RECOGNIZED_INTEGRATION_PACKAGES = [
  "@commet/ai-sdk",
  "@commet/better-auth",
  "@commet/next",
] as const;

interface SourceConfiguration {
  environmentVariables: string[];
  integrationPackages: string[];
  integrationPaths: Map<string, string>;
  scanFailures: string[];
}

function inspectSourceConfiguration(projectRoot: string): SourceConfiguration {
  const environmentVariables = new Set<string>();
  const integrationPackages = new Set<string>();
  const integrationPaths = new Map<string, string>();
  const scanFailures: string[] = [];
  const directories = [projectRoot];

  while (directories.length > 0) {
    const directory = directories.pop();
    if (!directory) continue;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_SOURCE_DIRECTORIES.has(entry.name)) directories.push(path);
        continue;
      }
      if (!SOURCE_EXTENSIONS.has(extension(entry.name))) continue;
      if (/\.(?:spec|test)\.[cm]?[jt]sx?$/.test(entry.name)) continue;

      const source = readFileSync(path, "utf8");
      try {
        for (const variableName of findRequiredEnvironmentVariables(
          source,
          entry.name,
        )) {
          environmentVariables.add(variableName);
        }
      } catch {
        scanFailures.push(relative(projectRoot, path));
      }
      const importSource = stripComments(source);
      for (const packageName of RECOGNIZED_INTEGRATION_PACKAGES) {
        const escapedPackageName = packageName.replace("/", "\\/");
        const importPattern = new RegExp(
          `(?:from\\s*|import\\s*\\(\\s*|require\\s*\\(\\s*|import\\s*)["']${escapedPackageName}(?:\\/[^"']*)?["']`,
        );
        if (!importPattern.test(importSource)) continue;
        integrationPackages.add(packageName);
        if (!integrationPaths.has(packageName)) {
          integrationPaths.set(packageName, relative(projectRoot, path));
        }
      }
    }
  }

  return {
    environmentVariables: [...environmentVariables].sort(),
    integrationPackages: [...integrationPackages].sort(),
    integrationPaths,
    scanFailures: scanFailures.sort(),
  };
}

export function findRequiredEnvironmentVariables(
  source: string,
  fileName = "source.tsx",
): string[] {
  const environmentVariables = new Set<string>();
  const syntaxTree: unknown = /\.[cm]?[jt]sx$/.test(fileName)
    ? parse(source, {
        sourceType: "unambiguous",
        errorRecovery: true,
        plugins: ["decorators-legacy", "typescript", "jsx"],
      })
    : parse(source, {
        sourceType: "unambiguous",
        errorRecovery: true,
        plugins: ["decorators-legacy", "typescript"],
      });

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value !== "object" || value === null) return;
    const type = Reflect.get(value, "type");
    if (type === "MemberExpression" || type === "OptionalMemberExpression") {
      const variableName = memberPropertyName(value);
      if (
        variableName &&
        REQUIRED_COMMET_ENVIRONMENT_VARIABLES.has(variableName) &&
        isEnvironmentObject(Reflect.get(value, "object"))
      ) {
        environmentVariables.add(variableName);
      }
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(syntaxTree);
  return [...environmentVariables].sort();
}

function memberPropertyName(value: object): string | undefined {
  const property = Reflect.get(value, "property");
  if (typeof property !== "object" || property === null) return undefined;
  const propertyType = Reflect.get(property, "type");
  const computed = Reflect.get(value, "computed") === true;
  if (propertyType === "Identifier" && !computed) {
    const name = Reflect.get(property, "name");
    return typeof name === "string" ? name : undefined;
  }
  if (propertyType === "StringLiteral" && computed) {
    const stringValue = Reflect.get(property, "value");
    return typeof stringValue === "string" ? stringValue : undefined;
  }
  return undefined;
}

function isEnvironmentObject(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const type = Reflect.get(value, "type");
  if (type !== "MemberExpression" && type !== "OptionalMemberExpression") {
    return false;
  }
  if (memberPropertyName(value) !== "env") return false;
  const environmentOwner = Reflect.get(value, "object");
  if (typeof environmentOwner !== "object" || environmentOwner === null) {
    return false;
  }
  if (Reflect.get(environmentOwner, "type") === "Identifier") {
    return Reflect.get(environmentOwner, "name") === "process";
  }
  if (Reflect.get(environmentOwner, "type") !== "MetaProperty") return false;
  const meta = Reflect.get(environmentOwner, "meta");
  const property = Reflect.get(environmentOwner, "property");
  return (
    typeof meta === "object" &&
    meta !== null &&
    Reflect.get(meta, "name") === "import" &&
    typeof property === "object" &&
    property !== null &&
    Reflect.get(property, "name") === "meta"
  );
}

function stripComments(source: string): string {
  let result = "";
  let state: "code" | "single" | "double" | "template" | "line" | "block" =
    "code";
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];
    if (!character) continue;

    if (state === "line") {
      if (character === "\n") {
        state = "code";
        result += "\n";
      } else {
        result += " ";
      }
      continue;
    }
    if (state === "block") {
      if (character === "*" && nextCharacter === "/") {
        result += "  ";
        index += 1;
        state = "code";
      } else {
        result += character === "\n" ? "\n" : " ";
      }
      continue;
    }
    if (state !== "code") {
      result += character;
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (
        (state === "single" && character === "'") ||
        (state === "double" && character === '"') ||
        (state === "template" && character === "`")
      ) {
        state = "code";
      }
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      result += "  ";
      index += 1;
      state = "line";
      continue;
    }
    if (character === "/" && nextCharacter === "*") {
      result += "  ";
      index += 1;
      state = "block";
      continue;
    }
    if (character === "'" || character === '"' || character === "`") {
      result += character;
      state =
        character === "'"
          ? "single"
          : character === '"'
            ? "double"
            : "template";
      continue;
    }
    result += character;
  }

  return result;
}

function extension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot);
}

function findEnvironmentVariableSource(
  projectRoot: string,
  variableName: string,
): string | undefined {
  if (process.env[variableName]?.trim()) return "process environment";

  const nodeEnvironment = process.env.NODE_ENV?.trim() || "development";
  const environmentFiles = [
    `.env.${nodeEnvironment}.local`,
    ...(nodeEnvironment === "test" ? [] : [".env.local"]),
    `.env.${nodeEnvironment}`,
    ".env",
  ];
  for (const environmentFile of environmentFiles) {
    const envPath = join(projectRoot, environmentFile);
    if (!existsSync(envPath)) continue;
    const value = readEnvironmentVariable(
      readFileSync(envPath, "utf8"),
      variableName,
    );
    if (value?.trim()) return environmentFile;
  }
  return undefined;
}

function readEnvironmentVariable(
  content: string,
  variableName: string,
): string | undefined {
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/,
    );
    if (match?.[1] !== variableName) continue;
    const rawValue = match[2]?.trim();
    if (!rawValue) return undefined;
    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      return rawValue.slice(1, -1);
    }
    return rawValue.replace(/\s+#.*$/, "").trim();
  }
  return undefined;
}

function readInstalledApiVersion(
  packages: InstalledCommetPackage[],
): string | undefined {
  const nodePackage = packages.find(
    (packageInfo) => packageInfo.name === "@commet/node",
  );
  if (!nodePackage?.manifestPath) return undefined;
  const manifestPath = join(
    dirname(nodePackage.manifestPath),
    "docs",
    "manifest.json",
  );
  if (!existsSync(manifestPath)) return undefined;
  try {
    const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (typeof parsed !== "object" || parsed === null) return undefined;
    const apiVersion = Reflect.get(parsed, "apiVersion");
    return typeof apiVersion === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(apiVersion)
      ? apiVersion
      : undefined;
  } catch {
    return undefined;
  }
}

function readProjectContext(configPath: string):
  | {
      organizationId: string;
      organizationName: string;
      mode: "live" | "sandbox";
    }
  | undefined {
  try {
    const parsed: unknown = JSON.parse(readFileSync(configPath, "utf8"));
    if (typeof parsed !== "object" || parsed === null) return undefined;
    const organizationId = Reflect.get(parsed, "orgId");
    const organizationName = Reflect.get(parsed, "orgName");
    const mode = Reflect.get(parsed, "mode");
    if (
      typeof organizationId !== "string" ||
      organizationId.trim().length === 0 ||
      typeof organizationName !== "string" ||
      organizationName.trim().length === 0 ||
      (mode !== "live" && mode !== "sandbox")
    ) {
      return undefined;
    }
    return { organizationId, organizationName, mode };
  } catch {
    return undefined;
  }
}

export const doctorCommand = new Command("doctor")
  .description("Diagnose the local Commet installation without changing it")
  .option("--directory <path>", "Project directory", process.cwd())
  .option(
    "--output <format>",
    "Output format: human (default) or agent",
    "human",
  )
  .action((options: DoctorOptions) => {
    const report = runDoctor(resolve(options.directory ?? process.cwd()));
    if (options.output === "agent") {
      console.log(JSON.stringify(report));
    } else {
      console.log(
        chalk.bold(
          `Commet doctor · ${relative(process.cwd(), report.projectRoot) || "."}`,
        ),
      );
      for (const check of report.checks) {
        const marker =
          check.status === "pass"
            ? chalk.green("✓")
            : check.status === "warning"
              ? chalk.yellow("⚠")
              : chalk.red("✗");
        console.log(`${marker} ${check.message}`);
        if (check.impact) console.log(chalk.dim(`  Impact: ${check.impact}`));
        if (check.action) console.log(chalk.dim(`  Action: ${check.action}`));
      }
    }
    if (report.status === "issues") process.exitCode = 1;
  });
