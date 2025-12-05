import { Commet, type Environment } from "@commet/node";

const apiKey = process.env.COMMET_API_KEY || "ck_build_placeholder";
const environment = process.env.COMMET_ENVIRONMENT as Environment;
const planId = process.env.COMMET_PLAN_ID || "build_placeholder";
const eventType = process.env.COMMET_EVENT_TYPE || "api_call";

export const commet = new Commet({
  apiKey,
  environment,
});

export const COMMET_PLAN_ID = planId;
export const COMMET_EVENT_TYPE = eventType;


