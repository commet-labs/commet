import { commetAI } from "@commet/ai-sdk";
import { gateway, streamText } from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { commet } from "@/lib/commet";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = commetAI(gateway("anthropic/claude-sonnet-4-20250514"), {
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
