import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { extract as tarExtract } from "tar";
import { commetColor, promptTheme } from "../utils/prompt-theme";

const GITHUB_REPO = "commet-labs/commet";

const TEMPLATES = [
  {
    name: "fixed",
    dir: "fixed-saas",
    description: "Fixed subscriptions (monthly/yearly plans)",
  },
  {
    name: "seats",
    dir: "team-saas",
    description: "Seat-based billing (per team member)",
  },
  {
    name: "credits",
    dir: "credits-saas",
    description: "Credit-based billing (prepaid usage blocks)",
  },
  {
    name: "usage-based",
    dir: "usage-based-saas",
    description: "Usage-based billing (metered, pay for what you use)",
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

export const createCommand = new Command("create")
  .description("Create a new Commet app from a template")
  .argument("[name]", "Project name")
  .option(
    "-t, --template <template>",
    "Template to use (fixed, seats, credits, usage-based)",
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

    let projectName = argName;
    try {
      if (!projectName) {
        projectName = await input({
          message: "Project name:",
          theme: promptTheme,
        });
      }
    } catch {
      console.log(chalk.yellow("\n⚠ Cancelled"));
      return;
    }

    const dest = path.resolve(projectName);
    if (fs.existsSync(dest)) {
      console.log(chalk.red(`✗ Directory "${projectName}" already exists`));
      return;
    }

    let template = TEMPLATES.find((t) => t.name === opts.template);

    if (opts.template && !template) {
      console.log(chalk.red(`✗ Unknown template "${opts.template}"`));
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
      console.log(chalk.yellow("\n⚠ Cancelled"));
      return;
    }

    const spinner = ora("Downloading template...").start();

    try {
      await downloadTemplate(template.dir, dest, opts.ref);
      spinner.succeed("Template downloaded");
    } catch (error) {
      spinner.fail("Failed to download template");
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

    console.log(chalk.green(`\n✓ Created ${projectName}`));
    console.log(chalk.dim(`  Template: ${template.name}`));
    console.log();
    console.log(`  ${chalk.cyan("cd")} ${projectName}`);
    console.log(`  ${chalk.dim("Update .env with your keys")}`);
    console.log(`  ${chalk.cyan("npm install")}`);
    console.log(`  ${chalk.cyan("npm run dev")}`);
    console.log();
  });
