import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Better Auth SaaS - Commet Plugin Showcase",
  description:
    "A showcase of the @commet/better-auth plugin demonstrating seats, usage tracking, and feature flags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

