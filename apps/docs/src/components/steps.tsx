import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return <div className="fd-steps">{children}</div>;
}

Steps.Step = function Step({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="fd-step">
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
};

export function Step({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="fd-step">
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
}
