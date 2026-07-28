import { Commet, type Feature, type Plan } from "@commet/node";
import { loadProjectConfig } from "./config";
import { exitWithError } from "./output";

export function createSdkClient(): Commet {
  const envKey = process.env.COMMET_API_KEY;
  if (envKey) {
    return new Commet({ apiKey: envKey });
  }

  const config = loadProjectConfig();
  if (config?.apiKey) {
    return new Commet({ apiKey: config.apiKey });
  }

  exitWithError({
    code: "api_key_required",
    message:
      "No API key found. Set COMMET_API_KEY env var, or run `commet link` to auto-generate one.",
    action: "commet link",
  });
}

export async function fetchRemoteState(
  commet: Commet,
): Promise<
  | { features: Feature[]; plans: Plan[] }
  | { error: { code: string; message: string } }
> {
  let features: Feature[];
  try {
    features = (await commet.features.list()).data;
  } catch (error) {
    return {
      error: {
        code: "fetch_features_failed",
        message:
          error instanceof Error ? error.message : "Failed to fetch features",
      },
    };
  }

  try {
    const plans = (await commet.plans.list({ includePrivate: true })).data;
    return { features, plans };
  } catch (error) {
    return {
      error: {
        code: "fetch_plans_failed",
        message:
          error instanceof Error ? error.message : "Failed to fetch plans",
      },
    };
  }
}
