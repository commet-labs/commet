import { Commet } from "@commet/node";

const apiKey = process.env.COMMET_API_KEY || "ck_build_placeholder";
const environment = (process.env.COMMET_ENVIRONMENT || "sandbox") as
  | "sandbox"
  | "production";

export const commet = new Commet({
  apiKey,
  environment,
});


