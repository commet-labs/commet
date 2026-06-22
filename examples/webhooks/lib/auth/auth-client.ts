import { commetClient } from "@commet/better-auth/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [commetClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
