import { Commet } from "@commet/node";

const apiKey = process.env.COMMET_API_KEY || "ck_build_placeholder";
const environment = (process.env.COMMET_ENVIRONMENT || "sandbox") as
  | "sandbox"
  | "production";
const planId = process.env.COMMET_PLAN_ID || "build_placeholder";

export const commet = new Commet({
  apiKey,
  environment,
});

export const COMMET_PLAN_ID = planId;
