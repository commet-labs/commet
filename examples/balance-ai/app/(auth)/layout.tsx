export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
