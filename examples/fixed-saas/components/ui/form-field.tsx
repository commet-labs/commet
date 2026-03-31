"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  description?: string;
}

export function FormField({
  label,
  error,
  description,
  id,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive/50",
          className,
        )}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive-foreground">{error}</p>}
    </div>
  );
}
