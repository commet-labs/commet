import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { Command } from "commander";
import open from "open";
import ora from "ora";
import { getBaseURL } from "../utils/api";
import { authExists, loadAuth, saveAuth } from "../utils/config";
import { promptTheme } from "../utils/prompt-theme";

export const loginCommand = new Command("login")
  .description("Authenticate with Commet")
  .action(async () => {
    // Check if already logged in
    if (authExists()) {
      const auth = loadAuth();
      console.log(chalk.yellow("⚠ You are already logged in."));
      console.log(
        chalk.dim(
          "Run `commet logout` first if you want to login with a different account.",
        ),
      );
      return;
    }

    // Ask user to select environment
    let environment: "sandbox" | "production";
    try {
      environment = await select<"sandbox" | "production">({
        message: "Select environment to login:",
        choices: [
          {
            name: `Sandbox ${chalk.dim("(Development)")}`,
            value: "sandbox",
          },
          {
            name: "Production",
            value: "production",
          },
        ],
        default: "sandbox",
        theme: promptTheme,
      });
    } catch (error) {
      // User cancelled with Ctrl+C
      console.log(chalk.yellow("\n⚠ Login cancelled"));
      return;
    }

    const spinner = ora("Initiating login flow...").start();
    const baseURL = getBaseURL(environment);

    try {
      // 1. Request device code from Better Auth
      const deviceResponse = await fetch(`${baseURL}/api/auth/device/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "commet-cli",
          scope: "openid profile email",
        }),
      });

      if (!deviceResponse.ok) {
        spinner.fail("Failed to initiate login");
        console.error(chalk.red("Error:"), await deviceResponse.text());
        return;
      }

      const deviceData = (await deviceResponse.json()) as {
        device_code: string;
        user_code: string;
        verification_uri_complete: string;
        interval?: number;
      };
      const {
        device_code,
        user_code,
        verification_uri_complete,
        interval = 5,
      } = deviceData;

      spinner.stop();

      // 2. Display instructions to user
      console.log(chalk.bold("\n🔐 Commet CLI Login\n"));
      console.log("Visit the following URL in your browser:");
      console.log(chalk.cyan.underline(verification_uri_complete));
      console.log("\nOr enter this code manually:");
      console.log(chalk.bold.green(`  ${user_code}`));
      console.log(chalk.dim("\nOpening browser...\n"));

      // 3. Open browser
      try {
        await open(verification_uri_complete);
      } catch {
        console.log(chalk.yellow("⚠ Could not open browser automatically."));
      }

      // 4. Start polling for token
      const pollSpinner = ora("Waiting for authorization...").start();

      let pollingInterval = interval;
      let attempts = 0;
      const maxAttempts = 180 / pollingInterval; // 3 minutes total

      const poll = async (): Promise<void> => {
        if (attempts >= maxAttempts) {
          pollSpinner.fail("Login timed out");
          console.log(chalk.red("Authorization timed out. Please try again."));
          return;
        }

        attempts++;

        try {
          const tokenResponse = await fetch(
            `${baseURL}/api/auth/device/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                device_code,
                client_id: "commet-cli",
              }),
            },
          );

          const tokenData = (await tokenResponse.json()) as {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
            error?: string;
          };

          if (tokenData.access_token) {
            // Success!
            const authConfig: {
              token: string;
              refreshToken?: string;
              expiresAt?: number;
              environment: "sandbox" | "production";
            } = {
              token: tokenData.access_token,
              environment,
            };

            if (tokenData.refresh_token) {
              authConfig.refreshToken = tokenData.refresh_token;
            }

            if (tokenData.expires_in) {
              authConfig.expiresAt = Date.now() + tokenData.expires_in * 1000;
            }

            saveAuth(authConfig);

            pollSpinner.succeed("Successfully logged in!");
            console.log(chalk.green("\n✓ Authentication complete"));
            console.log(
              chalk.dim(
                "\nNext steps:\n  1. Run `commet link` to connect a project\n  2. Run `commet pull` to generate types\n",
              ),
            );
            return;
          }

          if (tokenData.error === "authorization_pending") {
            // Still waiting, continue polling
            setTimeout(() => poll(), pollingInterval * 1000);
          } else if (tokenData.error === "slow_down") {
            // Increase polling interval
            pollingInterval += 5;
            setTimeout(() => poll(), pollingInterval * 1000);
          } else if (tokenData.error === "access_denied") {
            pollSpinner.fail("Authorization denied");
            console.log(chalk.red("\n✗ You denied the authorization request."));
            return;
          } else if (tokenData.error === "expired_token") {
            pollSpinner.fail("Code expired");
            console.log(
              chalk.red(
                "\n✗ The authorization code expired. Please try again.",
              ),
            );
            return;
          } else {
            pollSpinner.fail("Authorization failed");
            console.log(
              chalk.red("\n✗ Error:"),
              tokenData.error || "Unknown error",
            );
            return;
          }
        } catch (error) {
          pollSpinner.fail("Network error");
          console.error(
            chalk.red("Error:"),
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      };

      // Start polling
      poll();
    } catch (error) {
      spinner.fail("Login failed");
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  });
