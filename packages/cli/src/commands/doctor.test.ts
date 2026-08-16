import assert from "node:assert/strict";
import test from "node:test";
import type { InstalledCommetPackage } from "../utils/agent-project";
import { evaluatePackageCompatibility } from "./doctor";

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
