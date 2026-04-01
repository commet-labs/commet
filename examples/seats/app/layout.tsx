import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { TemplateHeader } from "@/components/template-header";

export const metadata: Metadata = {
  title: "Seats SaaS",
  description: "Seat-based pricing SaaS with subscription billing via Commet.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon-light.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon-dark.svg",
      },
    ],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexSans.className} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <TemplateHeader templateName="Seats SaaS" />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
