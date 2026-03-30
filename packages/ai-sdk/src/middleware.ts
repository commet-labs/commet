import type { LanguageModelV3 } from "@ai-sdk/provider";
import { type LanguageModelMiddleware, wrapLanguageModel } from "ai";
import type { AIUsageTrackResponse, CommetAIOptions } from "./types";

function getBaseUrl(
  environment: "production" | "sandbox" = "production",
): string {
  return environment === "production"
    ? "https://commet.co"
    : "https://sandbox.commet.co";
}

interface TokenUsage {
  inputTokens: {
    total: number | undefined;
    cacheRead: number | undefined;
    cacheWrite: number | undefined;
  };
  outputTokens: {
    total: number | undefined;
  };
}

async function reportTokenUsage(
  options: CommetAIOptions,
  modelId: string,
  usage: TokenUsage,
): Promise<AIUsageTrackResponse | null> {
  const inputTokens = usage.inputTokens?.total ?? 0;
  const outputTokens = usage.outputTokens?.total ?? 0;

  if (inputTokens === 0 && outputTokens === 0) return null;

  const cacheReadTokens = usage.inputTokens?.cacheRead ?? 0;
  const cacheWriteTokens = usage.inputTokens?.cacheWrite ?? 0;

  const baseUrl = getBaseUrl(options.environment);

  try {
    const response = await fetch(`${baseUrl}/api/usage/events`, {
      method: "POST",
      headers: {
        "x-api-key": options.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feature: options.feature,
        customerId: options.customerId,
        model: modelId,
        inputTokens,
        outputTokens,
        ...(cacheReadTokens > 0 && { cacheReadTokens }),
        ...(cacheWriteTokens > 0 && { cacheWriteTokens }),
        idempotencyKey: options.idempotencyKey,
      }),
    });

    return (await response.json()) as AIUsageTrackResponse;
  } catch (error) {
    const trackingError =
      error instanceof Error ? error : new Error("Unknown tracking error");

    if (options.onTrackingError) {
      options.onTrackingError(trackingError);
    } else {
      console.warn(
        "[commet/ai-sdk] Failed to report token usage:",
        trackingError.message,
      );
    }
    return null;
  }
}

export function commetAI(
  model: LanguageModelV3,
  options: CommetAIOptions,
): LanguageModelV3 {
  if (!options.apiKey) {
    throw new Error("@commet/ai-sdk: apiKey is required");
  }
  if (!options.feature) {
    throw new Error("@commet/ai-sdk: feature is required");
  }
  if (!options.customerId) {
    throw new Error("@commet/ai-sdk: customerId is required");
  }

  const middleware: LanguageModelMiddleware = {
    specificationVersion: "v3",
    wrapGenerate: async ({ doGenerate, model: wrappedModel }) => {
      const result = await doGenerate();

      reportTokenUsage(options, wrappedModel.modelId, result.usage).catch(
        () => {},
      );

      return result;
    },

    wrapStream: async ({ doStream, model: wrappedModel }) => {
      const { stream, ...rest } = await doStream();

      const trackingStream = stream.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (chunk.type === "finish") {
              reportTokenUsage(
                options,
                wrappedModel.modelId,
                chunk.usage,
              ).catch(() => {});
            }

            controller.enqueue(chunk);
          },
        }),
      );

      return { stream: trackingStream, ...rest };
    },
  };

  return wrapLanguageModel({ model, middleware });
}
