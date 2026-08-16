import { execFileSync } from "node:child_process";
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
      "package/docs/api-reference/index.md",
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
  let nodeTarball;
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
    if (expectation.directory === "node") nodeTarball = tarballPath;
    console.log(`${tarballName}: ${statSync(tarballPath).size} bytes`);
  }

  if (!nodeTarball)
    throw new Error("The @commet/node tarball was not produced");
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
      "--no-audit",
      "--no-fund",
      "--prefix",
      consumerRoot,
      nodeTarball,
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
  execFileSync(
    "node",
    [
      "-e",
      "const fs=require('node:fs'); const sdk=require('@commet/node'); const manifest=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); const client=new sdk.Commet({apiKey:'ck_package_verification',telemetry:false}); for(const resource of manifest.resources){ for(const operation of resource.operations){ if(typeof client[resource.name]?.[operation.name] !== 'function'){ throw new Error('Missing '+resource.name+'.'+operation.name); } } }",
      installedDocs,
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
