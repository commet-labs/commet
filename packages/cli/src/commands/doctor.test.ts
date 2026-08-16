import assert from "node:assert/strict";
import test from "node:test";
import type { InstalledCommetPackage } from "../utils/agent-project";
import {
  evaluatePackageCompatibility,
  findRequiredEnvironmentVariables,
} from "./doctor";

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

test("doctor recognizes only executable Commet environment access", () => {
  const textualExamples = `
    // process.env.COMMET_API_KEY
    /* import.meta.env.COMMET_WEBHOOK_SECRET */
    export const doubleQuoted = "process.env.COMMET_API_KEY";
    export const singleQuoted = 'import.meta.env["COMMET_WEBHOOK_SECRET"]';
    export const template = \`process.env.COMMET_API_KEY\`;
    export const matcher = /process.env.COMMET_API_KEY/;
    export const jsxText = <code>process.env.COMMET_API_KEY</code>;
  `;
  assert.deepEqual(findRequiredEnvironmentVariables(textualExamples), []);
  assert.deepEqual(
    findRequiredEnvironmentVariables(`
      const apiKey = process.env.COMMET_API_KEY;
      const webhookSecret = import.meta.env["COMMET_WEBHOOK_SECRET"];
      const authorization = \`Bearer \${process.env.COMMET_API_KEY}\`;
      const jsxExpression = <code>{process.env.COMMET_API_KEY}</code>;
    `),
    ["COMMET_API_KEY", "COMMET_WEBHOOK_SECRET"],
  );
});
