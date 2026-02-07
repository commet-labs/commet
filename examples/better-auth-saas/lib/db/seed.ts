import { db } from "./drizzle";
import { user, account } from "./schema";

async function seed() {
  const email = "test@test.com";
  const userId = crypto.randomUUID();

  // Create user with Better Auth schema
  await db.insert(user).values({
    id: userId,
    email: email,
    name: "Test User",
    emailVerified: true,
  });

  // Create account with credential provider for password login
  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
  });

  console.log("Initial user created:", email);
  console.log("Note: Password authentication requires signing up via the UI");
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed process finished. Exiting...");
    process.exit(0);
  });
