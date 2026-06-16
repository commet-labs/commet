import { Commet } from "@commet/node";

const apiKey = process.env.COMMET_API_KEY || "ck_build_placeholder";

export const commet = new Commet({
  apiKey,
});
