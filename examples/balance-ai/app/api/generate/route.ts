import { tracked } from "@commet/ai-sdk";
import { gateway, streamText } from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { commet } from "@/lib/commet";

const ALLOWED_MODELS = new Set([
  "anthropic/claude-haiku-4.5",
  "openai/gpt-4o-mini",
  "google/gemini-2.5-flash",
]);

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as { model?: string };
  const modelId = body.model ?? "anthropic/claude-haiku-4.5";

  if (!ALLOWED_MODELS.has(modelId)) {
    return new Response("Invalid model", { status: 400 });
  }

  const model = tracked(gateway(modelId), {
    commet,
    feature: "ai_chat",
    customerId: session.user.id,
  });

  const result = streamText({
    model,
    prompt:
      "Write a short, interesting fun fact about technology in 2-3 sentences.",
  });

  return result.toTextStreamResponse();
}
