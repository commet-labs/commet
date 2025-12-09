import "@/app/global.css";
import { i18n } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});
const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    es: {
      displayName: "Español",
      search: "Buscar",
    },
  },
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://commet.co/docs",
  ),
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
