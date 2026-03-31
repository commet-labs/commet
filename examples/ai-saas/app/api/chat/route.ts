import { commetAI } from "@commet/ai-sdk";
import { gateway, streamText } from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { commet } from "@/lib/commet";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await request.json();

  const model = commetAI(gateway("anthropic/claude-sonnet-4-20250514"), {
    commet,
    feature: "ai_chat" as never,
    customerId: session.user.id,
  });

  const result = streamText({
    model,
    system:
      "You are a helpful AI assistant. Be concise and direct in your responses.",
    messages,
  });

  return result.toDataStreamResponse();
}
