import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { InstalledCommetPackage } from "../utils/agent-project";
import { evaluatePackageCompatibility, runDoctor } from "./doctor";

function installedPackage(
  name: string,
  version: string,
  nodeRange?: string,
): InstalledCommetPackage {
  return {
    name,
    manifestPath: `/project/node_modules/${name}/package.json`,
    documentationPath: `/project/node_modules/${name}/README.md`,
    manifest: {
      name,
      version,
      peerDependencies: nodeRange ? { "@commet/node": nodeRange } : {},
    },
  };
}

test("doctor accepts an integration inside its declared Node range", () => {
  const checks = evaluatePackageCompatibility([
    installedPackage("@commet/node", "9.1.0"),
    installedPackage("@commet/better-auth", "8.1.0", ">=9.1.0 <10.0.0"),
  ]);

  assert.equal(
    checks.some((check) => check.code === "PACKAGE_VERSION_MISMATCH"),
    false,
  );
  assert.equal(
    checks.some((check) => check.code === "PACKAGE_VERSION_COMPATIBLE"),
    true,
  );
});

test("doctor rejects an integration outside its declared Node range", () => {
  const checks = evaluatePackageCompatibility([
    installedPackage("@commet/node", "10.0.0"),
    installedPackage("@commet/better-auth", "8.1.0", ">=9.1.0 <10.0.0"),
  ]);
  const mismatch = checks.find(
    (check) => check.code === "PACKAGE_VERSION_MISMATCH",
  );

  assert.equal(mismatch?.status, "fail");
  assert.deepEqual(mismatch?.evidence, {
    installedNodeVersion: "10.0.0",
    supportedNodeRange: ">=9.1.0 <10.0.0",
  });
  assert.equal(typeof mismatch?.impact, "string");
  assert.equal(typeof mismatch?.action, "string");
});

test("doctor checks referenced variables without exposing their values", () => {
  const projectRoot = mkdtempSync(join(tmpdir(), "commet-doctor-"));
  try {
    writeFileSync(
      join(projectRoot, "package.json"),
      JSON.stringify({ dependencies: { "@commet/node": "9.1.0" } }),
    );
    mkdirSync(join(projectRoot, "src"));
    writeFileSync(
      join(projectRoot, "src", "commet.ts"),
      'import { Commet } from "@commet/node";\nnew Commet({ apiKey: process.env.COMMET_API_KEY });\n',
    );
    const installedPackageRoot = join(
      projectRoot,
      "node_modules",
      "@commet",
      "node",
    );
    mkdirSync(join(installedPackageRoot, "docs"), { recursive: true });
    writeFileSync(
      join(installedPackageRoot, "package.json"),
      JSON.stringify({
        name: "@commet/node",
        version: "9.1.0",
        peerDependencies: {},
      }),
    );
    writeFileSync(join(installedPackageRoot, "docs", "README.md"), "# Docs\n");
    writeFileSync(
      join(installedPackageRoot, "docs", "manifest.json"),
      JSON.stringify({ apiVersion: "2026-07-31" }),
    );
    writeFileSync(
      join(projectRoot, ".env.example"),
      "COMMET_API_KEY=ck_example_should_not_count\n",
    );

    const missingReport = runDoctor(projectRoot);
    const missingCheck = missingReport.checks.find(
      (check) => check.code === "ENVIRONMENT_VARIABLE_MISSING",
    );
    assert.equal(missingCheck?.evidence?.variable, "COMMET_API_KEY");
    assert.equal(JSON.stringify(missingReport).includes("ck_example"), false);

    writeFileSync(
      join(projectRoot, ".env.local"),
      "COMMET_API_KEY=ck_secret\n",
    );
    mkdirSync(join(projectRoot, ".commet"));
    writeFileSync(
      join(projectRoot, ".commet", "config.json"),
      JSON.stringify({
        orgId: "org_test",
        orgName: "Test Organization",
        mode: "sandbox",
        apiKey: "ck_config_secret",
      }),
    );
    const availableReport = runDoctor(projectRoot);
    const availableCheck = availableReport.checks.find(
      (check) => check.code === "ENVIRONMENT_VARIABLE_AVAILABLE",
    );
    assert.deepEqual(availableCheck?.evidence, {
      variable: "COMMET_API_KEY",
      source: ".env.local",
    });
    assert.equal(JSON.stringify(availableReport).includes("ck_secret"), false);
    assert.equal(
      JSON.stringify(availableReport).includes("ck_config_secret"),
      false,
    );
    assert.deepEqual(
      availableReport.checks.find(
        (check) => check.code === "PROJECT_CONTEXT_VALID",
      )?.evidence,
      {
        organizationId: "org_test",
        organizationName: "Test Organization",
        mode: "sandbox",
        path: join(projectRoot, ".commet", "config.json"),
      },
    );
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});
