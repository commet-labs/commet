import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GenerateForm } from "./generate-form";

export default function DashboardPage() {
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
            Pick a model and generate text. Commet bills tokens automatically
            based on the model's real cost + your margin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateForm />
        </CardContent>
      </Card>
    </div>
  );
}
