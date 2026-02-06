"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  isPending: boolean;
  pendingText?: string;
  icon?: ReactNode;
}

export function SubmitButton({
  children,
  isPending,
  pendingText = "Saving...",
  icon,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" className="bg-primary" disabled={isPending} {...props}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
}
