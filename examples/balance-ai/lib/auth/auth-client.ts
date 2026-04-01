import { commetClient } from "@commet/better-auth/client";
import { createAuthClient } from "better-auth/react";
import { env } from "../env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [commetClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
