import * as fs from "node:fs";
import * as path from "node:path";

interface UpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Updates .gitignore to include a new entry
 * Simple search in current directory only - creates .gitignore if it doesn't exist
 *
 * @param entry - The entry to add to .gitignore (e.g., ".commet/")
 * @returns Result object with success status and optional error message
 */
export function updateGitignore(entry: string): UpdateResult {
  const cwd = process.cwd();
  const gitignorePath = path.join(cwd, ".gitignore");

  try {
    let content = "";

    // Read existing content if file exists
    if (fs.existsSync(gitignorePath)) {
      content = fs.readFileSync(gitignorePath, "utf8");

      // Check if entry already exists
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === entry) {
          return { success: true }; // Already exists, nothing to do
        }
      }
    }

    // Add entry to content
    // Ensure there's a newline at the end if content exists
    if (content && !content.endsWith("\n")) {
      content += "\n";
    }

    content += `${entry}\n`;

    // Write back to file
    fs.writeFileSync(gitignorePath, content, "utf8");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error updating .gitignore",
    };
  }
}
