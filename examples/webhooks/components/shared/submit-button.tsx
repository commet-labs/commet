"use client";

import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
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
    <Button type="submit" disabled={isPending} {...props}>
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
