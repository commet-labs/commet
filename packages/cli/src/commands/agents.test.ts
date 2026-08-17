import assert from "node:assert/strict";
import test from "node:test";
import {
  AGENT_RULES_BEGIN,
  AGENT_RULES_END,
  removeManagedAgentRules,
  renderAgentRules,
  updateManagedAgentRules,
} from "./agents";

test("agent rules expose the single installed documentation entrypoint", () => {
  assert.equal(
    renderAgentRules(),
    `<!-- BEGIN:commet-agent-rules -->

# Commet

Before changing a Commet integration, read the version-matched documentation installed in this project:

- \`node_modules/@commet/node/docs/README.md\`

Run \`commet doctor --output agent\` before making integration changes. The command is local and read-only.

<!-- END:commet-agent-rules -->`,
  );
});

test("managed agent rules preserve project-owned content", () => {
  const existing = "# Project\n\nKeep this rule.\n";
  const block = renderAgentRules();

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
  const block = renderAgentRules();
  const content = `# Project\n\n${block}\n\n## Local rules\n\nKeep this.\n`;

  assert.equal(
    removeManagedAgentRules(content),
    "# Project\n\n## Local rules\n\nKeep this.\n",
  );
});

test("duplicate managed blocks are rejected", () => {
  const block = renderAgentRules();

  assert.throws(
    () => updateManagedAgentRules(`${block}\n\n${block}\n`, block),
    /invalid Commet managed block/,
  );
});
