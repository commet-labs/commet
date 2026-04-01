"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MODELS = [
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
];

export function GenerateForm() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0]!.id);

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    });

    if (!response.ok || !response.body) {
      setLoading(false);
      setResult("Something went wrong. Check your API keys.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setResult(text);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={loading}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
      {loading && !result && <Skeleton className="h-20 w-full" />}
      {result && (
        <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
