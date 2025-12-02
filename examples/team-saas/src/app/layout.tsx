import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamPro - Team Collaboration with Seat-Based Billing",
  description:
    "A team collaboration platform demonstrating Commet seat-based billing integration",
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

