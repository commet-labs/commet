import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI SaaS",
  description: "AI-powered SaaS with usage-based billing via Commet.",
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
    <html lang="en" className={`dark ${ibmPlexSans.className}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
