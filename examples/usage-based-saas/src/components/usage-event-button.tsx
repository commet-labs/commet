"use client";

import { reportUsageAction } from "@/actions/report-usage-action";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UsageEventButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const result = await reportUsageAction();

    if (!result.success) {
      setError(result.error || "No se pudo enviar el evento");
    } else {
      setMessage("Evento de uso enviado (api_call + amount:1).");
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={handleSend} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar evento de uso"}
      </Button>
      {message && (
        <p className="text-xs text-green-600 text-center">{message}</p>
      )}
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  );
}
