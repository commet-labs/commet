import { Commet } from "@commet/node";

// Get environment variables - use placeholders for build time
const apiKey = process.env.COMMET_API_KEY || "ck_build_placeholder";
const environment = (process.env.COMMET_ENVIRONMENT || "sandbox") as
  | "sandbox"
  | "production";
const priceId = process.env.COMMET_PRICE_ID || "build_placeholder";

// Initialize Commet SDK
export const commet = new Commet({
  apiKey,
  environment,
});

// Export price ID
export const COMMET_PRICE_ID = priceId;
