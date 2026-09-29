import assert from "node:assert/strict";
import { test } from "node:test";
import { parseNullableNumber, parseNumber } from "./param-types";

test("nullable numeric options preserve explicit null and finite durations", () => {
  assert.equal(parseNullableNumber("null"), null);
  assert.equal(parseNullableNumber("30"), 30);
  assert.equal(parseNullableNumber("0"), 0);
  assert.throws(() => parseNullableNumber("invalid"), /Invalid number/);
});

test("non-nullable numeric options still reject null", () => {
  assert.throws(() => parseNumber("null"), /Invalid number/);
});
