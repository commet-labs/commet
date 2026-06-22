import "server-only";

import { z } from "zod";

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const envSchema = z.object({
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  COMMET_API_KEY: z.string().min(1, "COMMET_API_KEY is required"),
  COMMET_WEBHOOK_SECRET: z.string().min(1, "COMMET_WEBHOOK_SECRET is required"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  RESEND_API_KEY: optionalNonEmptyString,
  EMAIL_FROM: optionalNonEmptyString,
});

export const env = envSchema.parse(process.env);
