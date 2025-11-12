import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <Link href="/" className="mb-8">
        <div className="text-3xl font-bold">SaaSPro</div>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
