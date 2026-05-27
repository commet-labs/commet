import { Commet } from "@commet/node";
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
