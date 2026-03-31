"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    const response = await fetch("/api/generate", { method: "POST" });

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
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Generate text with AI. Each request tracks token usage via Commet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Text Generator</CardTitle>
          <CardDescription>
            Click the button to generate a short text. Tokens are billed automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate text"}
          </Button>
          {loading && !result && <Skeleton className="h-20 w-full" />}
          {result && (
            <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
