import { ImageIcon, MessageSquare, Mic } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CREDIT_COSTS = [
  { action: "Image Generation", cost: 10, icon: ImageIcon },
  { action: "Text Generation", cost: 2, icon: MessageSquare },
  { action: "Voice Synthesis", cost: 25, icon: Mic },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your credit-based plan and usage costs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credits per Action</CardTitle>
          <CardDescription>
            How many credits each action consumes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {CREDIT_COSTS.map((item) => (
            <div
              key={item.action}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <item.icon className="size-4 text-muted-foreground" />
                <span className="text-sm">{item.action}</span>
              </div>
              <span className="text-sm font-medium">{item.cost} credits</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
