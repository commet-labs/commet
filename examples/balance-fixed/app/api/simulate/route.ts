import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as { feature?: string };
  const featureCode = body.feature;

  if (
    !featureCode ||
    !["api_calls", "image_processing"].includes(featureCode)
  ) {
    return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
  }

  const result = await commet.usage.track({
    customerId: user.id,
    feature: featureCode,
    value: 1,
  });

  if (!result.success) {
    return NextResponse.json({
      feature: featureCode,
      cost: "-",
      status: result.message || "Failed — balance may be exhausted",
    });
  }

  return NextResponse.json({
    feature: featureCode,
    cost: featureCode === "api_calls" ? "$0.001" : "$0.05",
    status: "Deducted from balance",
  });
}
