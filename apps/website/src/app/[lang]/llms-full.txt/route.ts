import { getLLMText } from "@/lib/get-llm-text";
import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";
import type { NextRequest } from "next/server";

// Pre-generate all language versions at build time
export function generateStaticParams() {
  return i18n.languages.map((locale: string) => ({
    lang: locale,
  }));
}

// Force static generation
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lang?: string }> },
) {
  const { lang } = await params;
  const scan = source.getPages(lang).map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
