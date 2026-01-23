"use client";

import { Header } from "@/components/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header variant="auth" />
      {children}
    </section>
  );
}
