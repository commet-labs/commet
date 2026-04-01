import { Commet } from "@commet/node";
import { env } from "./env";

export const commet = new Commet({
  apiKey: env.COMMET_API_KEY,
  environment: env.COMMET_ENVIRONMENT,
});
