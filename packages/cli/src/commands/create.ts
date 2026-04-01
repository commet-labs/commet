import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { input, select } from "@inquirer/prompts";
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

function copyEnvExample(dest: string) {
  const examplePath = path.join(dest, ".env.example");
  const envPath = path.join(dest, ".env");
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
  }
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

export const createCommand = new Command("create")
  .description("Create a new Commet app from a template")
  .argument("[name]", "Project name")
  .option(
    "-t, --template <template>",
    "Template to use (fixed, seats, metered, credits, balance-ai, balance-fixed)",
  )
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
    try {
      if (!projectName) {
        projectName = await input({
          message: "Project name:",
          theme: promptTheme,
        });
      }
    } catch {
      console.log(chalk.yellow("\n\u26A0 Cancelled"));
      return;
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

    if (organizations.length === 1) {
      selectedOrg = organizations[0]!;
    } else {
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

    try {
      if (!template) {
        const selected = await select<TemplateName>({
          message: "Billing model:",
          choices: TEMPLATES.map((t) => ({
            name: `${t.name.padEnd(14)} ${chalk.dim(t.description)}`,
            value: t.name,
          })),
          theme: promptTheme,
        });
        template = TEMPLATES.find((t) => t.name === selected)!;
      }
    } catch {
      console.log(chalk.yellow("\n\u26A0 Cancelled"));
      return;
    }

    // 5. Download template
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

    // 6. Create plans in platform
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

    // 7. Link project
    linkProject(dest, selectedOrg.id, selectedOrg.name, auth.environment);

    // 8. Done
    console.log(chalk.green(`\n\u2713 Created ${projectName}`));
    console.log(chalk.dim(`  Template: ${template.name}`));
    console.log(chalk.dim(`  Organization: ${selectedOrg.name}`));
    console.log();
    console.log(`  ${chalk.cyan("cd")} ${projectName}`);
    console.log(`  ${chalk.dim("Update .env with your keys")}`);
    console.log(`  ${chalk.cyan("npm install")}`);
    console.log(`  ${chalk.cyan("npm run dev")}`);
    console.log();
  });
