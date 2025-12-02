// Environment variable validation
export function validateEnv() {
  const required = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "COMMET_API_KEY",
    "COMMET_ENVIRONMENT",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

