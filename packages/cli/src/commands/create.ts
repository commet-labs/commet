import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { extract as tarExtract } from "tar";
import { apiRequest, getBaseURL } from "../utils/api";
import { authExists, loadAuth } from "../utils/config";
import { performLogin } from "../utils/login-flow";
import { commetColor, promptTheme } from "../utils/prompt-theme";

const GITHUB_REPO = "commet-labs/commet";

const TEMPLATES = [
  {
    name: "fixed",
    dir: "fixed",
    templateId: "fixed",
    description: "Fixed subscriptions with boolean features",
  },
  {
    name: "seats",
    dir: "seats",
    templateId: "seats",
    description: "Per-seat billing for team collaboration",
  },
  {
    name: "metered",
    dir: "metered",
    templateId: "metered",
    description: "Usage-based billing with included amounts and overage",
  },
  {
    name: "credits",
    dir: "credits",
    templateId: "credits",
    description: "Credit-based consumption with packs and top-ups",
  },
  {
    name: "balance-ai",
    dir: "balance-ai",
    templateId: "balance-ai",
    description: "AI product with automatic token cost tracking and margin",
  },
  {
    name: "balance-fixed",
    dir: "balance-fixed",
    templateId: "balance-fixed",
    description: "Prepaid balance with fixed unit prices",
  },
] as const;

type TemplateName = (typeof TEMPLATES)[number]["name"];

async function downloadTemplate(
  templateDir: string,
  dest: string,
  ref: string,
) {
  const url = `https://codeload.github.com/${GITHUB_REPO}/tar.gz/${ref}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download (HTTP ${response.status})`);
  }

  const tempFile = path.join(os.tmpdir(), `commet-${Date.now()}.tar.gz`);

  try {
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(tempFile, buffer);

    fs.mkdirSync(dest, { recursive: true });

    await tarExtract({
      file: tempFile,
      cwd: dest,
      strip: 3,
      filter: (entryPath: string) => {
        const parts = entryPath.split("/");
        return parts[1] === "examples" && parts[2] === templateDir;
      },
    });
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }

  const files = fs.readdirSync(dest);
  if (files.length === 0) {
    throw new Error(`Template "${templateDir}" not found in repository`);
  }
}

function updatePackageJson(dest: string, projectName: string) {
  const pkgPath = path.join(dest, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  pkg.version = "0.0.1";
  pkg.private = true;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function fetchLatestVersion(packageName: string): Promise<string> {
  const response = await fetch(
    `https://registry.npmjs.org/${packageName}/latest`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch version for ${packageName} (HTTP ${response.status})`,
    );
  }
  const data = (await response.json()) as { version: string };
  return data.version;
}

async function resolveWorkspaceDeps(dest: string): Promise<number> {
  const pkgPath = path.join(dest, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  const depSections = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ] as const;

  const workspaceDeps = new Map<string, Array<(typeof depSections)[number]>>();

  for (const section of depSections) {
    const deps = pkg[section];
    if (!deps) continue;
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === "string" && version.startsWith("workspace:")) {
        const existing = workspaceDeps.get(name);
        if (existing) {
          existing.push(section);
        } else {
          workspaceDeps.set(name, [section]);
        }
      }
    }
  }

  if (workspaceDeps.size === 0) return 0;

  const resolved = new Map<string, string>();
  await Promise.all(
    Array.from(workspaceDeps.keys()).map(async (name) => {
      resolved.set(name, await fetchLatestVersion(name));
    }),
  );

  for (const [name, sections] of workspaceDeps) {
    const version = resolved.get(name);
    if (!version) {
      throw new Error(`Could not resolve version for ${name}`);
    }
    for (const section of sections) {
      pkg[section][name] = version;
    }
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  return workspaceDeps.size;
}

function copyEnvExample(dest: string) {
  const examplePath = path.join(dest, ".env.example");
  const envPath = path.join(dest, ".env");
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
  }
}

function writeApiKeyToEnv(
  dest: string,
  apiKey: string,
  environment: "sandbox" | "production",
) {
  const envPath = path.join(dest, ".env");
  if (!fs.existsSync(envPath)) return;

  let content = fs.readFileSync(envPath, "utf-8");
  content = content.replace(/COMMET_API_KEY=.*/, `COMMET_API_KEY=${apiKey}`);
  content = content.replace(
    /COMMET_ENVIRONMENT=.*/,
    `COMMET_ENVIRONMENT=${environment}`,
  );
  fs.writeFileSync(envPath, content);
}

function linkProject(
  dest: string,
  orgId: string,
  orgName: string,
  environment: "sandbox" | "production",
) {
  const commetDir = path.join(dest, ".commet");
  fs.mkdirSync(commetDir, { recursive: true });
  fs.writeFileSync(
    path.join(commetDir, "config.json"),
    JSON.stringify({ orgId, orgName, environment }, null, 2),
    "utf8",
  );
}

function isInteractive(): boolean {
  return process.stdin.isTTY === true;
}

async function resolveSkills(opts: {
  skills?: boolean;
  yes?: boolean;
}): Promise<boolean> {
  if (typeof opts.skills === "boolean") return opts.skills;
  if (opts.yes) return true;
  if (!isInteractive()) return false;
  try {
    return await confirm({
      message: `Add ${commetColor("agent skills")}?`,
      default: true,
      theme: promptTheme,
    });
  } catch {
    return false;
  }
}

async function installSkills(projectRoot: string): Promise<void> {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";

  return new Promise((resolve) => {
    const child = spawn(
      npx,
      ["-y", "--loglevel=error", "skills", "add", "commet-labs/commet-skills"],
      { cwd: projectRoot, stdio: "inherit" },
    );

    child.on("close", (code: number | null) => {
      if (code !== 0) {
        console.log(chalk.dim("  You can install them manually by running:"));
        console.log(chalk.dim("  npx skills add commet-labs/commet-skills"));
      }
      resolve();
    });
  });
}

export const createCommand = new Command("create")
  .description("Create a new Commet app from a template")
  .argument("[name]", "Project name")
  .option(
    "-t, --template <template>",
    "Template to use (fixed, seats, metered, credits, balance-ai, balance-fixed)",
  )
  .option("--org <slug>", "Organization slug or ID (skips selection)")
  .option("--skills", "Install agent skills")
  .option("--no-skills", "Skip agent skills installation")
  .option("-y, --yes", "Accept defaults for optional prompts")
  .option("--ref <ref>", "Git ref to fetch templates from", "main")
  .option("--list", "List available templates")
  .action(async (argName: string | undefined, opts) => {
    if (opts.list) {
      console.log(chalk.bold("\nAvailable templates:\n"));
      for (const t of TEMPLATES) {
        console.log(
          `  ${commetColor(t.name.padEnd(14))}${chalk.dim(t.description)}`,
        );
      }
      console.log();
      return;
    }

    // 1. Project name
    let projectName = argName;
    if (!projectName) {
      if (!isInteractive()) {
        console.log(chalk.red("\u2717 Project name is required"));
        console.log(
          chalk.dim("Pass as positional argument: commet create <name>"),
        );
        return;
      }
      try {
        projectName = await input({
          message: "Project name:",
          theme: promptTheme,
        });
      } catch {
        console.log(chalk.yellow("\n\u26A0 Cancelled"));
        return;
      }
    }

    const dest = path.resolve(projectName);
    if (fs.existsSync(dest)) {
      console.log(
        chalk.red(`\u2717 Directory "${projectName}" already exists`),
      );
      return;
    }

    // 2. Login (if not authenticated)
    if (!authExists()) {
      if (!isInteractive()) {
        console.log(chalk.red("\u2717 Not authenticated"));
        console.log(chalk.dim("Run `commet login` first"));
        return;
      }
      let environment: "sandbox" | "production";
      try {
        environment = await select<"sandbox" | "production">({
          message: "Environment:",
          choices: [
            {
              name: `Sandbox ${chalk.dim("(Development)")}`,
              value: "sandbox",
            },
            { name: "Production", value: "production" },
          ],
          default: "sandbox",
          theme: promptTheme,
        });
      } catch {
        console.log(chalk.yellow("\n\u26A0 Cancelled"));
        return;
      }

      const loggedIn = await performLogin(environment);
      if (!loggedIn) {
        return;
      }
    }

    const auth = loadAuth()!;
    const baseURL = getBaseURL(auth.environment);

    if (auth.environment !== "sandbox") {
      console.log(
        chalk.red(
          "\u2717 `commet create` is only available in sandbox environment",
        ),
      );
      console.log(
        chalk.dim("Run `commet logout` and login to sandbox to use templates"),
      );
      return;
    }

    // 3. Select organization
    const orgsSpinner = ora("Fetching organizations...").start();
    const orgsResult = await apiRequest<{
      organizations: Array<{ id: string; name: string; slug: string }>;
    }>(`${baseURL}/api/cli/organizations`);

    if (orgsResult.error || !orgsResult.data) {
      orgsSpinner.fail("Failed to fetch organizations");
      console.log(chalk.dim(orgsResult.error));
      return;
    }

    const { organizations } = orgsResult.data;
    orgsSpinner.stop();

    if (organizations.length === 0) {
      console.log(chalk.yellow("\u26A0 No organizations found"));
      console.log(
        chalk.dim("Create an organization at https://commet.co first"),
      );
      return;
    }

    let selectedOrg: (typeof organizations)[0];

    if (opts.org) {
      const match = organizations.find(
        (org) => org.slug === opts.org || org.id === opts.org,
      );
      if (!match) {
        console.log(chalk.red(`\u2717 Organization "${opts.org}" not found`));
        console.log(
          chalk.dim(
            `Available: ${organizations.map((o) => o.slug).join(", ")}`,
          ),
        );
        return;
      }
      selectedOrg = match;
    } else if (organizations.length === 1) {
      selectedOrg = organizations[0]!;
    } else {
      if (!isInteractive()) {
        console.log(chalk.red("\u2717 Organization is required"));
        console.log(
          chalk.dim(
            `Pass --org=<slug>. Available: ${organizations.map((o) => o.slug).join(", ")}`,
          ),
        );
        return;
      }
      try {
        const orgId = await select({
          message: "Organization:",
          choices: organizations.map((org) => ({
            name: `${org.name} ${chalk.dim(`(${org.slug})`)}`,
            value: org.id,
          })),
          theme: promptTheme,
        });
        selectedOrg = organizations.find((org) => org.id === orgId)!;
      } catch {
        console.log(chalk.yellow("\n\u26A0 Cancelled"));
        return;
      }
    }

    // 4. Select template
    let template = TEMPLATES.find((t) => t.name === opts.template);

    if (opts.template && !template) {
      console.log(chalk.red(`\u2717 Unknown template "${opts.template}"`));
      console.log(
        chalk.dim("Run `commet create --list` to see available templates"),
      );
      return;
    }

    if (!template) {
      if (!isInteractive()) {
        console.log(chalk.red("\u2717 Template is required"));
        console.log(
          chalk.dim(
            `Pass --template=<name>. Available: ${TEMPLATES.map((t) => t.name).join(", ")}`,
          ),
        );
        return;
      }
      try {
        const selected = await select<TemplateName>({
          message: "Billing model:",
          choices: TEMPLATES.map((t) => ({
            name: `${t.name.padEnd(14)} ${chalk.dim(t.description)}`,
            value: t.name,
          })),
          theme: promptTheme,
        });
        template = TEMPLATES.find((t) => t.name === selected)!;
      } catch {
        console.log(chalk.yellow("\n\u26A0 Cancelled"));
        return;
      }
    }

    // 5. Agent skills
    const shouldInstallSkills = await resolveSkills(opts);

    // 6. Download template
    const downloadSpinner = ora("Downloading template...").start();

    try {
      await downloadTemplate(template.dir, dest, opts.ref);
      downloadSpinner.succeed("Template downloaded");
    } catch (error) {
      downloadSpinner.fail("Failed to download template");
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      return;
    }

    updatePackageJson(dest, projectName);
    copyEnvExample(dest);

    // 7. Resolve workspace:* deps to published npm versions
    const resolveSpinner = ora("Resolving package versions...").start();
    try {
      const count = await resolveWorkspaceDeps(dest);
      if (count > 0) {
        resolveSpinner.succeed(`Resolved ${count} package versions`);
      } else {
        resolveSpinner.stop();
      }
    } catch (error) {
      resolveSpinner.fail("Failed to resolve package versions");
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      return;
    }

    // 8. Create plans in platform
    const planSpinner = ora("Creating plans...").start();
    const templateResult = await apiRequest<{
      plansCreated: number;
      featuresCreated: number;
    }>(`${baseURL}/api/cli/templates`, {
      method: "POST",
      body: JSON.stringify({
        templateId: template.templateId,
        organizationId: selectedOrg.id,
      }),
    });

    if (templateResult.error || !templateResult.data) {
      planSpinner.fail("Failed to create plans");
      console.log(chalk.dim(templateResult.error));
    } else {
      planSpinner.succeed(
        `Created ${templateResult.data.plansCreated} plans and ${templateResult.data.featuresCreated} features`,
      );
    }

    // 9. Create API key
    const keySpinner = ora("Creating API key...").start();
    const keyResult = await apiRequest<{
      apiKey: string;
    }>(`${baseURL}/api/cli/api-keys`, {
      method: "POST",
      body: JSON.stringify({
        organizationId: selectedOrg.id,
        name: `${template.name} (CLI)`,
      }),
    });

    if (keyResult.error || !keyResult.data) {
      keySpinner.fail("Failed to create API key");
      console.log(chalk.dim(keyResult.error));
      console.log(chalk.dim("You can create one manually in the dashboard"));
    } else {
      writeApiKeyToEnv(dest, keyResult.data.apiKey, auth.environment);
      keySpinner.succeed("API key created and saved to .env");
    }

    // 10. Link project
    linkProject(dest, selectedOrg.id, selectedOrg.name, auth.environment);

    // 11. Install skills
    if (shouldInstallSkills) {
      await installSkills(dest);
    }

    // 12. Done
    console.log(chalk.green(`\n\u2713 Created ${projectName}`));
    console.log(chalk.dim(`  Template: ${template.name}`));
    console.log(chalk.dim(`  Organization: ${selectedOrg.name}`));
    console.log();
    console.log(`  ${chalk.cyan("cd")} ${projectName}`);
    console.log(`  ${chalk.cyan("npm install")}`);
    console.log(`  ${chalk.cyan("npm run dev")}`);
    console.log();
  });
