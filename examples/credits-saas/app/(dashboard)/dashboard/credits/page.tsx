import { trackUsageAction } from "@/app/actions/credits";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Code,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";

export default async function CreditsPage() {

  const features = [
    {
      id: "ai_generation",
      name: "AI Image Generation",
      description: "Generate high-quality images using our latest models.",
      cost: 50,
      icon: <ImageIcon className="w-5 h-5 text-gray-700" />,
      color: "bg-gray-100",
    },
    {
      id: "ai_chat",
      name: "AI Assistant",
      description: "Chat with an advanced AI that understands context.",
      cost: 10,
      icon: <MessageSquare className="w-5 h-5 text-gray-700" />,
      color: "bg-gray-100",
    },
    {
      id: "code_review",
      name: "Code Review",
      description: "Get instant feedback and optimizations for your code.",
      cost: 25,
      icon: <Code className="w-5 h-5 text-gray-700" />,
      color: "bg-gray-100",
    },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Credit Management
            </h1>
            <p className="text-gray-500">
              Test credit consumption features using Commet SDK
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Actions Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-700" />
              Simulate Credit Consumption
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`h-1.5 ${feature.color.replace("bg-", "bg-opacity-50 bg-")}`}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-sm font-bold">
                        {feature.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </span>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-bold text-gray-900">
                          {feature.cost}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          credits
                        </span>
                      </div>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await trackUsageAction(feature.id, feature.cost);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full text-xs font-semibold h-9 gap-2"
                      >
                        Execute Feature
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-700" />
              Quota Status
            </h2>

            <div className="space-y-4">
              <UsageMeter
                title="AI Images"
                used={420}
                total={1000}
                unit="images"
              />
              <UsageMeter
                title="API Calls"
                used={8420}
                total={10000}
                unit="reqs"
              />
            </div>

            <Card className="bg-gray-900 text-white border-none shadow-lg shadow-gray-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Usage Tracking</h3>
                <p className="text-gray-300 text-sm mb-6 opacity-80 leading-relaxed">
                  All usage events are tracked via Commet SDK using the{" "}
                  <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">
                    commet.usage.track()
                  </code>{" "}
                  method. Credits and balance management will be available when
                  the SDK adds support for these features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
