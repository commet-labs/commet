"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [result, setResult] = useState<{
    feature: string;
    cost: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSimulate(feature: string) {
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Simulate usage to see balance deductions in real time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Call</CardTitle>
            <CardDescription>$0.001 per call</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSimulate("api_calls")}
              disabled={loading}
            >
              {loading ? "Simulating..." : "Simulate API Call"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Processing</CardTitle>
            <CardDescription>$0.05 per image</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSimulate("image_processing")}
              disabled={loading}
            >
              {loading ? "Simulating..." : "Process Image"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Feature</span>
              <span className="font-medium">{result.feature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost</span>
              <span className="font-medium">{result.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{result.status}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
