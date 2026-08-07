export function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Invalid JSON: ${value}`);
  }
}

export function parseNumber(value: string): number {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid finite number: ${value}`);
  }
  return num;
}

export function parseSafeInteger(value: string): number {
  const number = parseNumber(value);
  if (!Number.isSafeInteger(number)) {
    throw new Error(`Invalid safe integer: ${value}`);
  }
  return number;
}

export function parseNonNegativeNumber(value: string): number {
  const number = parseNumber(value);
  if (number < 0) {
    throw new Error(`Invalid non-negative number: ${value}`);
  }
  return number;
}

export function parseNonNegativeInteger(value: string): number {
  const number = parseSafeInteger(value);
  if (number < 0) {
    throw new Error(`Invalid non-negative integer: ${value}`);
  }
  return number;
}

export function parsePositiveInteger(value: string): number {
  const number = parseSafeInteger(value);
  if (number <= 0) {
    throw new Error(`Invalid positive integer: ${value}`);
  }
  return number;
}

export function parsePostgresInteger(value: string): number {
  const number = parseSafeInteger(value);
  if (number < -2_147_483_648 || number > 2_147_483_647) {
    throw new Error(`Invalid PostgreSQL integer: ${value}`);
  }
  return number;
}

export function parseNonNegativePostgresInteger(value: string): number {
  const number = parsePostgresInteger(value);
  if (number < 0) {
    throw new Error(`Invalid non-negative PostgreSQL integer: ${value}`);
  }
  return number;
}

export function parsePositivePostgresInteger(value: string): number {
  const number = parsePostgresInteger(value);
  if (number <= 0) {
    throw new Error(`Invalid positive PostgreSQL integer: ${value}`);
  }
  return number;
}

export function parseBool(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean: ${value}. Expected "true" or "false".`);
}
