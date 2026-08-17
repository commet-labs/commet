import assert from "node:assert/strict";
import test from "node:test";
import { resolveCliCommand } from "./command-name";

test("CLI command resolution ignores global option values", () => {
  assert.equal(resolveCliCommand(["doctor", "--output", "agent"]), "doctor");
  assert.equal(resolveCliCommand(["--output", "human", "doctor"]), "doctor");
  assert.equal(
    resolveCliCommand(["--output=agent", "agents", "setup"]),
    "agents",
  );
  assert.equal(resolveCliCommand(["--help"]), "(default)");
});
