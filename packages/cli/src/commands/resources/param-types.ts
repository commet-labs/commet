export function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Invalid JSON: ${value}`);
  }
}

export function parseNumber(value: string): number {
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return num;
}

export function parseBool(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean: ${value}. Expected "true" or "false".`);
}
