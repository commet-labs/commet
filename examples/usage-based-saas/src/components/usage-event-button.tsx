"use client";

import { reportUsageAction } from "@/actions/report-usage-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function UsageEventButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(1);

  async function handleSend() {
    // Validate count is at least 1
    const eventCount = Math.max(1, Math.floor(count));
    if (eventCount < 1) {
      setError("El número de eventos debe ser al menos 1");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    const result = await reportUsageAction(eventCount);

    if (!result.success) {
      setError(result.error || "No se pudo enviar el evento");
    } else {
      const eventText = eventCount === 1 ? "evento" : "eventos";
      setMessage(
        `${eventCount} ${eventText} de uso enviado${eventCount > 1 ? "s" : ""}.`,
      );
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label htmlFor="event-count" className="text-sm font-medium">
          Cantidad de eventos
        </label>
        <Input
          id="event-count"
          type="number"
          min={1}
          value={count}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value, 10);
            if (!Number.isNaN(value) && value >= 1) {
              setCount(value);
            } else if (e.target.value === "") {
              setCount(1);
            }
          }}
          disabled={isLoading}
          placeholder="1"
        />
      </div>
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
