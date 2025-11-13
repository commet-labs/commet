import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";
import { remarkInclude } from "fumadocs-mdx/config";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm);

export async function getLLMText(page: InferPageType<typeof source>) {
  // Construct absolute path from page.path
  // page.path is relative to content/docs (e.g., "en/platform/features/subscriptions/subscriptions-overview")
  // process.cwd() is already at apps/docs during build
  // Ensure path ends with .mdx (remove it first if present to avoid duplication)
  const basePath = page.path.endsWith(".mdx")
    ? page.path.slice(0, -4)
    : page.path;
  const filePath = join(process.cwd(), "content", "docs", `${basePath}.mdx`);

  // Read the file content directly from the filesystem
  const fileContent = await readFile(filePath, "utf-8");

  const processed = await processor.process({
    path: filePath,
    value: fileContent,
  });

  // note: it doesn't escape frontmatter, it's up to you.
  return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
}
