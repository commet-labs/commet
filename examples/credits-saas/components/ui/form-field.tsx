"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface FormFieldProps extends ComponentProps<typeof Input> {
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
        className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
