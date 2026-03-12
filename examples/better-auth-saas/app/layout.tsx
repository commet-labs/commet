import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description:
    "Launch your SaaS with auth, billing, and team management built in.",
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
      <body className="min-h-[100dvh] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
