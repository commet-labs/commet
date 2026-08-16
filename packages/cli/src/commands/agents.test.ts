import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  AGENT_RULES_BEGIN,
  AGENT_RULES_END,
  removeManagedAgentRules,
  renderAgentRules,
  setupAgentRules,
  updateManagedAgentRules,
} from "./agents";

test("managed agent rules preserve project-owned content", () => {
  const existing = "# Project\n\nKeep this rule.\n";
  const block = renderAgentRules([
    {
      name: "@commet/node",
      documentation: "node_modules/@commet/node/docs/README.md",
    },
  ]);

  const created = updateManagedAgentRules(existing, block);
  const unchanged = updateManagedAgentRules(created.content, block);

  assert.equal(created.status, "created");
  assert.match(created.content, /^# Project\n\nKeep this rule\./);
  assert.match(created.content, new RegExp(AGENT_RULES_BEGIN));
  assert.match(created.content, new RegExp(AGENT_RULES_END));
  assert.equal(unchanged.status, "unchanged");
  assert.equal(unchanged.content, created.content);
});

test("removing managed rules leaves project-owned content intact", () => {
  const block = renderAgentRules([
    {
      name: "@commet/node",
      documentation: "node_modules/@commet/node/docs/README.md",
    },
  ]);
  const content = `# Project\n\n${block}\n\n## Local rules\n\nKeep this.\n`;

  assert.equal(
    removeManagedAgentRules(content),
    "# Project\n\n## Local rules\n\nKeep this.\n",
  );
});

test("setup is detectable, idempotent, dry-run safe, and reversible", () => {
  const projectRoot = mkdtempSync(join(tmpdir(), "commet-agents-"));
  const agentsPath = join(projectRoot, "AGENTS.md");
  try {
    writeFileSync(
      join(projectRoot, "package.json"),
      JSON.stringify({ dependencies: { "@commet/node": "^9.1.0" } }),
    );
    writeFileSync(agentsPath, "# Project\n\nKeep this rule.\n");

    assert.equal(
      setupAgentRules(projectRoot, { dryRun: true }).status,
      "created",
    );
    assert.equal(
      readFileSync(agentsPath, "utf8"),
      "# Project\n\nKeep this rule.\n",
    );

    assert.equal(setupAgentRules(projectRoot).status, "created");
    assert.equal(setupAgentRules(projectRoot).status, "unchanged");
    assert.equal(
      setupAgentRules(projectRoot, { check: true }).status,
      "unchanged",
    );
    assert.equal(
      setupAgentRules(projectRoot, { remove: true, dryRun: true }).status,
      "removed",
    );
    assert.match(readFileSync(agentsPath, "utf8"), /commet-agent-rules/);

    assert.equal(
      setupAgentRules(projectRoot, { remove: true }).status,
      "removed",
    );
    assert.equal(
      readFileSync(agentsPath, "utf8"),
      "# Project\n\nKeep this rule.\n",
    );
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});
