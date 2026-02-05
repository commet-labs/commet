import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fixed SaaS - Better Auth Demo",
  description: "Get started quickly with Next.js, Better Auth, and Commet.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${ibmPlexMono.className}`}
    >
      <body className="min-h-[100dvh] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
