import * as fs from "node:fs";
import * as path from "node:path";
import { applyEdits, modify, parse } from "jsonc-parser";

interface UpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Updates tsconfig.json to include a new entry in the include array
 * Preserves comments and formatting using jsonc-parser
 * 
 * @param entry - The entry to add to the include array (e.g., ".commet/types.d.ts")
 * @returns Result object with success status and optional error message
 */
export function updateTsConfig(entry: string): UpdateResult {
  const cwd = process.cwd();
  const tsconfigPath = path.join(cwd, "tsconfig.json");

  try {
    // Check if file exists
    if (!fs.existsSync(tsconfigPath)) {
      return {
        success: false,
        error: "tsconfig.json not found",
      };
    }

    // Read file content
    const content = fs.readFileSync(tsconfigPath, "utf8");

    // Parse the JSON (supports comments)
    const config = parse(content);

    // Check if entry already exists in include array
    if (config.include && Array.isArray(config.include)) {
      if (config.include.includes(entry)) {
        return { success: true }; // Already included, nothing to do
      }
    }

    // Get current include array or create empty one
    const currentInclude = config.include || [];
    const newInclude = [...currentInclude, entry];

    // Create edit to add/update the include array
    const edits = modify(content, ["include"], newInclude, {
      formattingOptions: {
        insertSpaces: true,
        tabSize: 2,
      },
    });

    // Apply edits
    const updatedContent = applyEdits(content, edits);

    // Write back to file
    fs.writeFileSync(tsconfigPath, updatedContent, "utf8");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error updating tsconfig.json",
    };
  }
}

