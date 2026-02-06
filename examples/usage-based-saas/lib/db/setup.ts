import { exec } from "node:child_process";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { promisify } from "node:util";

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function getPostgresURL(): Promise<string> {
  console.log("Step 1: Setting up Postgres");
  const dbChoice = await question(
    "Do you want to use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): ",
  );

  if (dbChoice.toLowerCase() === "l") {
    console.log("Setting up local Postgres instance with Docker...");
    await setupLocalPostgres();
    return "postgres://postgres:postgres@localhost:54322/postgres";
  }

  console.log(
    "You can find Postgres databases at: https://vercel.com/marketplace?category=databases",
  );
  return await question("Enter your POSTGRES_URL: ");
}

async function setupLocalPostgres() {
  console.log("Checking if Docker is installed...");
  try {
    await execAsync("docker --version");
    console.log("Docker is installed.");
  } catch (error) {
    console.error(
      "Docker is not installed. Please install Docker and try again.",
    );
    console.log(
      "To install Docker, visit: https://docs.docker.com/get-docker/",
    );
    process.exit(1);
  }

  console.log("Creating docker-compose.yml file...");
  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: usage_based_saas_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  await fs.writeFile(
    path.join(process.cwd(), "docker-compose.yml"),
    dockerComposeContent,
  );
  console.log("docker-compose.yml file created.");

  console.log("Starting Docker container with `docker compose up -d`...");
  try {
    await execAsync("docker compose up -d");
    console.log("Docker container started successfully.");
  } catch (error) {
    console.error(
      "Failed to start Docker container. Please check your Docker installation and try again.",
    );
    process.exit(1);
  }
}

async function getCommetApiKey(): Promise<string> {
  console.log("Step 2: Getting Commet API Key");
  console.log(
    "You can find your Commet API Key at: https://app.commet.co/settings/api-keys",
  );
  return await question("Enter your Commet API Key: ");
}

async function getCommetEnvironment(): Promise<string> {
  console.log("Step 3: Setting Commet Environment");
  const envChoice = await question(
    "Use sandbox (S) or production (P)? (S/P) [default: S]: ",
  );

  if (envChoice.toLowerCase() === "p") {
    return "production";
  }
  return "sandbox";
}

function generateAuthSecret(): string {
  console.log("Step 4: Generating AUTH_SECRET...");
  return crypto.randomBytes(32).toString("hex");
}

async function writeEnvFile(envVars: Record<string, string>) {
  console.log("Step 5: Writing environment variables to .env");
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  await fs.writeFile(path.join(process.cwd(), ".env"), envContent);
  console.log(".env file created with the necessary variables.");
}

async function main() {
  const POSTGRES_URL = await getPostgresURL();
  const COMMET_API_KEY = await getCommetApiKey();
  const COMMET_ENVIRONMENT = await getCommetEnvironment();
  const BASE_URL = "http://localhost:3000";
  const AUTH_SECRET = generateAuthSecret();

  await writeEnvFile({
    POSTGRES_URL,
    COMMET_API_KEY,
    COMMET_ENVIRONMENT,
    BASE_URL,
    AUTH_SECRET,
  });

  console.log("Setup completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Run: pnpm db:push");
  console.log("2. Run: pnpm db:seed (optional)");
  console.log("3. Run: pnpm dev");
}

main().catch(console.error);
