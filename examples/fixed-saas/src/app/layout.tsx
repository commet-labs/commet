import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaSPro - Powered by Commet",
  description:
    "A simple SaaS platform demonstrating Commet billing integration",
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
