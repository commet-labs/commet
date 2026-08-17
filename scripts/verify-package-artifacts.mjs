import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const packageExpectations = [
  {
    directory: "node",
    files: [
      "package/docs/README.md",
      "package/docs/manifest.json",
      "package/docs/platform-documentation.md",
      "package/docs/documentation/subscriptions/plan-grants.md",
      "package/docs/knowledge-base/how-does-billing-work.md",
      "package/docs/ai-onboarding/ai-onboarding.md",
      "package/docs/webhooks/payment-received.md",
      "package/docs/api-reference/index.md",
      "package/docs/schemas.md",
      "package/docs/errors/index.md",
      "package/docs/errors/customer_not_found.md",
    ],
  },
  { directory: "next", files: ["package/README.md"] },
  { directory: "ai-sdk", files: ["package/README.md"] },
  { directory: "better-auth", files: ["package/README.md"] },
  {
    directory: "cli",
    files: ["package/README.md", "package/bin/commet", "package/dist/index.js"],
  },
];

const temporaryRoot = mkdtempSync(join(tmpdir(), "commet-packages-"));
try {
  const tarballs = new Map();
  for (const expectation of packageExpectations) {
    const packageRoot = join(repositoryRoot, "packages", expectation.directory);
    const destination = join(temporaryRoot, expectation.directory);
    mkdirSync(destination, { recursive: true });
    execFileSync("pnpm", ["pack", "--pack-destination", destination], {
      cwd: packageRoot,
      stdio: "ignore",
    });
    const tarballName = readdirSync(destination).find((name) =>
      name.endsWith(".tgz"),
    );
    if (!tarballName) {
      throw new Error(`No tarball produced for ${expectation.directory}`);
    }
    const tarballPath = join(destination, tarballName);
    const entries = execFileSync("tar", ["-tf", tarballPath], {
      encoding: "utf8",
    }).split("\n");
    for (const expectedFile of expectation.files) {
      if (!entries.includes(expectedFile)) {
        throw new Error(`${tarballName} is missing ${expectedFile}`);
      }
    }

    const packedManifest = JSON.parse(
      execFileSync("tar", ["-xOf", tarballPath, "package/package.json"], {
        encoding: "utf8",
      }),
    );
    for (const lifecycleScript of ["preinstall", "install", "postinstall"]) {
      if (packedManifest.scripts?.[lifecycleScript]) {
        throw new Error(`${tarballName} declares ${lifecycleScript}`);
      }
    }
    if (["next", "ai-sdk", "better-auth"].includes(expectation.directory)) {
      const supportedNodeRange =
        packedManifest.peerDependencies?.["@commet/node"];
      if (supportedNodeRange !== ">=9.1.0 <10.0.0") {
        throw new Error(
          `${tarballName} has unexpected @commet/node peer range: ${supportedNodeRange}`,
        );
      }
    }
    tarballs.set(expectation.directory, tarballPath);
    console.log(`${tarballName}: ${statSync(tarballPath).size} bytes`);
  }

  if (tarballs.size !== packageExpectations.length) {
    throw new Error("Not every package tarball was produced");
  }
  const consumerRoot = join(temporaryRoot, "consumer");
  mkdirSync(consumerRoot);
  writeFileSync(
    join(consumerRoot, "package.json"),
    JSON.stringify({ private: true }),
  );
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--legacy-peer-deps",
      "--no-audit",
      "--no-fund",
      "--prefix",
      consumerRoot,
      ...tarballs.values(),
      "next@16.2.9",
      "react@19.2.7",
      "react-dom@19.2.7",
      "ai@6.0.199",
      "better-auth@1.6.16",
      "better-call@1.3.6",
      "zod@4.4.3",
    ],
    { stdio: "ignore" },
  );
  const installedSdkContract = execFileSync(
    "node",
    [
      "-e",
      "const sdk = require('@commet/node'); if (!sdk.Commet || !sdk.API_VERSION) process.exit(1); process.stdout.write(sdk.API_VERSION)",
    ],
    { cwd: consumerRoot, encoding: "utf8" },
  );
  const installedDocs = join(
    consumerRoot,
    "node_modules",
    "@commet",
    "node",
    "docs",
    "manifest.json",
  );
  if (!existsSync(installedDocs)) {
    throw new Error("Installed @commet/node is missing docs/manifest.json");
  }
  const installedManifest = JSON.parse(readFileSync(installedDocs, "utf8"));
  if (installedManifest.apiVersion !== installedSdkContract) {
    throw new Error(
      `Installed docs target ${installedManifest.apiVersion}, but the SDK targets ${installedSdkContract}`,
    );
  }
  if (
    installedManifest.errorReferences?.count !==
    installedManifest.errorReferences?.entries?.length
  ) {
    throw new Error("Installed error reference manifest is inconsistent");
  }
  if (
    installedManifest.platformDocumentation?.count !==
      installedManifest.platformDocumentation?.entries?.length
  ) {
    throw new Error("Installed Platform documentation manifest is inconsistent");
  }
  for (const documentationPath of installedManifest.platformDocumentation
    .entries) {
    if (documentationPath.endsWith(".mdx")) {
      throw new Error(`Installed documentation kept MDX path ${documentationPath}`);
    }
    if (
      !existsSync(
        join(
          consumerRoot,
          "node_modules",
          "@commet",
          "node",
          "docs",
          documentationPath,
        ),
      )
    ) {
      throw new Error(`Installed docs are missing ${documentationPath}`);
    }
  }
  const installedWebhookDocumentation = readFileSync(
    join(
      consumerRoot,
      "node_modules",
      "@commet",
      "node",
      "docs",
      "webhooks",
      "payment-received.md",
    ),
    "utf8",
  );
  if (
    installedWebhookDocumentation.includes("WebhookEventDoc") ||
    !installedWebhookDocumentation.includes("```json")
  ) {
    throw new Error("Installed webhook documentation was not serialized");
  }
  for (const errorReference of installedManifest.errorReferences.entries) {
    if (
      !existsSync(
        join(
          consumerRoot,
          "node_modules",
          "@commet",
          "node",
          "docs",
          errorReference.documentation,
        ),
      )
    ) {
      throw new Error(
        `Installed docs are missing ${errorReference.documentation}`,
      );
    }
  }
  execFileSync(
    "node",
    [
      "-e",
      "const fs=require('node:fs'); const sdk=require('@commet/node'); const manifest=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); const client=new sdk.Commet({apiKey:'ck_package_verification',telemetry:false}); for(const resource of manifest.resources){ for(const operation of resource.operations){ if(typeof client[resource.name]?.[operation.name] !== 'function'){ throw new Error('Missing '+resource.name+'.'+operation.name); } } }",
      installedDocs,
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  execFileSync(
    "node",
    [
      "-e",
      "for(const packageName of ['@commet/node','@commet/next','@commet/ai-sdk','@commet/better-auth','@commet/better-auth/client']) { const loaded=require(packageName); if(!loaded || typeof loaded !== 'object') throw new Error('Could not load '+packageName); } require.resolve('commet/package.json')",
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  const cliPath = join(consumerRoot, "node_modules", ".bin", "commet");
  if (!existsSync(cliPath)) throw new Error("Installed CLI is missing its bin");
  const cliHome = join(temporaryRoot, "cli-home");
  mkdirSync(cliHome);
  const networkGuardPath = join(temporaryRoot, "reject-network.cjs");
  writeFileSync(
    networkGuardPath,
    'globalThis.fetch = () => { throw new Error("Unexpected network access"); };\n',
  );
  const cliEnvironment = { ...process.env };
  cliEnvironment.HOME = cliHome;
  delete cliEnvironment.COMMET_NO_UPDATE_CHECK;
  delete cliEnvironment.COMMET_TELEMETRY_DISABLED;
  delete cliEnvironment.DO_NOT_TRACK;
  delete cliEnvironment.CI;
  cliEnvironment.NODE_OPTIONS = [
    cliEnvironment.NODE_OPTIONS,
    `--require=${networkGuardPath}`,
  ]
    .filter(Boolean)
    .join(" ");
  const runCli = (args) =>
    spawnSync(cliPath, args, {
      cwd: consumerRoot,
      encoding: "utf8",
      env: cliEnvironment,
    });

  const help = spawnSync(cliPath, ["--help"], {
    cwd: consumerRoot,
    encoding: "utf8",
    env: {
      ...cliEnvironment,
      COMMET_NO_UPDATE_CHECK: "1",
      COMMET_TELEMETRY_DISABLED: "1",
    },
  });
  if (help.status !== 0 || !help.stdout.includes("agents")) {
    throw new Error(`Installed CLI help failed: ${help.stderr}`);
  }

  const originalAgentRules = "# Project\n\nKeep this rule.\n";
  const agentsPath = join(consumerRoot, "AGENTS.md");
  writeFileSync(agentsPath, originalAgentRules);
  const dryRun = runCli([
    "agents",
    "setup",
    "--directory",
    consumerRoot,
    "--dry-run",
    "--output",
    "agent",
  ]);
  assertCliResult(dryRun, 0, "agent setup dry-run");
  if (readFileSync(agentsPath, "utf8") !== originalAgentRules) {
    throw new Error("Agent setup dry-run changed AGENTS.md");
  }

  const created = runCli([
    "agents",
    "setup",
    "--directory",
    consumerRoot,
    "--output",
    "agent",
  ]);
  assertCliResult(created, 0, "agent setup");
  if (JSON.parse(created.stdout).status !== "created") {
    throw new Error("Agent setup did not report created");
  }
  const unchanged = runCli([
    "agents",
    "setup",
    "--directory",
    consumerRoot,
    "--check",
    "--output",
    "agent",
  ]);
  assertCliResult(unchanged, 0, "agent setup check");
  if (JSON.parse(unchanged.stdout).status !== "unchanged") {
    throw new Error("Agent setup is not idempotent");
  }

  mkdirSync(join(consumerRoot, "src"));
  writeFileSync(
    join(consumerRoot, "src", "commet.ts"),
    'import { CustomerPortal } from "@commet/next";\nCustomerPortal({ apiKey: process.env.COMMET_API_KEY });\n',
  );
  writeFileSync(join(consumerRoot, ".env.local"), "COMMET_API_KEY=ck_secret\n");
  mkdirSync(join(consumerRoot, ".commet"));
  writeFileSync(
    join(consumerRoot, ".commet", "config.json"),
    JSON.stringify({
      orgId: "org_package_test",
      orgName: "Package Test",
      mode: "sandbox",
      apiKey: "ck_config_secret",
    }),
  );
  const beforeDoctor = projectState(consumerRoot);
  const doctor = runCli([
    "doctor",
    "--directory",
    consumerRoot,
    "--output",
    "agent",
  ]);
  if (doctor.status !== 0 && doctor.status !== 1) {
    throw new Error(`Installed doctor failed unexpectedly: ${doctor.stderr}`);
  }
  if (doctor.stderr.trim()) {
    throw new Error(`Installed doctor wrote to stderr: ${doctor.stderr}`);
  }
  const doctorReport = JSON.parse(doctor.stdout);
  if (doctorReport.schemaVersion !== 1 || !Array.isArray(doctorReport.checks)) {
    throw new Error("Installed doctor did not return its stable agent schema");
  }
  const doctorCheckCodes = new Set(
    doctorReport.checks.map((check) => check.code),
  );
  for (const requiredCode of [
    "AGENT_RULES_CURRENT",
    "API_VERSION_RESOLVED",
    "ENVIRONMENT_VARIABLE_AVAILABLE",
    "INTEGRATION_CONFIGURATION_DETECTED",
    "PROJECT_CONTEXT_VALID",
  ]) {
    if (!doctorCheckCodes.has(requiredCode)) {
      throw new Error(`Installed doctor is missing ${requiredCode}`);
    }
  }
  if (
    doctor.stdout.includes("ck_secret") ||
    doctor.stdout.includes("ck_config_secret")
  ) {
    throw new Error("Installed doctor exposed a secret value");
  }
  if (projectState(consumerRoot) !== beforeDoctor) {
    throw new Error("Installed doctor changed project files");
  }
  const doctorWithGlobalOptionFirst = runCli([
    "--output",
    "agent",
    "doctor",
    "--directory",
    consumerRoot,
  ]);
  if (
    doctorWithGlobalOptionFirst.status !== doctor.status ||
    doctorWithGlobalOptionFirst.stderr.trim()
  ) {
    throw new Error(
      `Installed doctor depends on global option ordering: ${doctorWithGlobalOptionFirst.stderr}`,
    );
  }

  const removed = runCli([
    "agents",
    "setup",
    "--directory",
    consumerRoot,
    "--remove",
    "--output",
    "agent",
  ]);
  assertCliResult(removed, 0, "agent setup removal");
  if (readFileSync(agentsPath, "utf8") !== originalAgentRules) {
    throw new Error("Agent setup removal changed project-owned instructions");
  }
  if (readdirSync(cliHome).length > 0) {
    throw new Error("Local-only CLI commands wrote outside the project");
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

function assertCliResult(result, expectedStatus, label) {
  if (result.status !== expectedStatus || result.stderr.trim()) {
    throw new Error(`${label} failed: ${result.stderr || result.stdout}`);
  }
}

function projectState(projectRoot) {
  const paths = [
    "package.json",
    "AGENTS.md",
    ".env.local",
    ".commet/config.json",
    "src/commet.ts",
  ];
  return JSON.stringify(
    paths.map((path) => {
      const absolutePath = join(projectRoot, path);
      return [
        path,
        existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : null,
      ];
    }),
  );
}
