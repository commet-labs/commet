import { DocsLayout } from "@/components/layout/notebook";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]/docs">) {
  const { lang } = await params;
  const { nav, ...base } = baseOptions(lang);

  return (
    <DocsLayout
      {...base}
      tree={source.pageTree[lang]}
      nav={{ ...nav, mode: "top" }}
      tabMode="navbar"
    >
      {children}
    </DocsLayout>
  );
}
