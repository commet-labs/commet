"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function useFormToast(state: ActionState) {
  const prevStateRef = useRef<ActionState>(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success(state.success);
    }
  }, [state]);
}
