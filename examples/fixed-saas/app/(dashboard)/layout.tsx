"use client";

import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header variant="default" />
      {children}
    </section>
  );
}
