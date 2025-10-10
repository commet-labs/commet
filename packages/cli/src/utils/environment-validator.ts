import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";

/**
 * Validates that the current directory is a TypeScript project
 * by checking for the presence of tsconfig.json
 *
 * @returns true if tsconfig.json exists and is valid, false otherwise
 */
export function validateTypeScriptProject(): boolean {
  const cwd = process.cwd();
  const tsconfigPath = path.join(cwd, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    return false;
  }

  // Validate that tsconfig.json is valid JSON
  try {
    const content = fs.readFileSync(tsconfigPath, "utf8");
    JSON.parse(content);
    return true;
  } catch (error) {
    return false;
  }
}
