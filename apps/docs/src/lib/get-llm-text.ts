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
    // Extendemos el tipo dinámicamente dentro de la función
    const data = page.data as InferPageType<typeof source>["data"] & {
      _file: { absolutePath: string };
      content: string;
    };

  const processed = await processor.process({
    path: data._file.absolutePath,
    value: data.content,
  });

  // note: it doesn't escape frontmatter, it's up to you.
  return `# ${page.data.title}
URL: ${page.url}

${processed.value}`;
}
