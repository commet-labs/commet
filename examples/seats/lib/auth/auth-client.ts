import { commetClient } from "@commet/better-auth/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3002",
  plugins: [commetClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
