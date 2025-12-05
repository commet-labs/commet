import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Usage-Based SaaS - Powered by Commet",
  description:
    "A usage-based SaaS platform demonstrating Commet billing integration",
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
