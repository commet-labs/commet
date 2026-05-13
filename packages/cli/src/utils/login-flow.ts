import chalk from "chalk";
import open from "open";
import ora from "ora";
import { BASE_URL } from "./api";
import { saveAuth } from "./config";
import { commetColor } from "./prompt-theme";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function performLogin(): Promise<boolean> {
  const spinner = ora("Initiating login flow...").start();

  try {
    const deviceResponse = await fetch(`${BASE_URL}/api/auth/device/code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "commet-cli",
        scope: "openid profile email",
      }),
    });

    if (!deviceResponse.ok) {
      spinner.fail("Failed to initiate login");
      return false;
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

    console.log(chalk.bold("\n\u{1F510} Commet CLI Login\n"));
    console.log("Visit the following URL in your browser:");
    console.log(commetColor.underline(verification_uri_complete));
    console.log("\nOr enter this code manually:");
    console.log(chalk.bold.green(`  ${user_code}`));
    console.log(chalk.dim("\nOpening browser...\n"));

    try {
      await open(verification_uri_complete);
    } catch {
      console.log(chalk.yellow("⚠ Could not open browser automatically."));
    }

    const pollSpinner = ora("Waiting for authorization...").start();
    let pollingInterval = interval;
    let attempts = 0;
    const maxAttempts = Math.floor(180 / pollingInterval);

    while (attempts < maxAttempts) {
      attempts++;
      await sleep(pollingInterval * 1000);

      try {
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/device/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
            device_code,
            client_id: "commet-cli",
          }),
        });

        const tokenData = (await tokenResponse.json()) as {
          access_token?: string;
          refresh_token?: string;
          expires_in?: number;
          error?: string;
        };

        if (tokenData.access_token) {
          const authConfig: {
            token: string;
            refreshToken?: string;
            expiresAt?: number;
          } = {
            token: tokenData.access_token,
          };

          if (tokenData.refresh_token) {
            authConfig.refreshToken = tokenData.refresh_token;
          }

          if (tokenData.expires_in) {
            authConfig.expiresAt = Date.now() + tokenData.expires_in * 1000;
          }

          saveAuth(authConfig);
          pollSpinner.succeed("Successfully logged in!");
          return true;
        }

        if (tokenData.error === "authorization_pending") {
          continue;
        }

        if (tokenData.error === "slow_down") {
          pollingInterval += 5;
          continue;
        }

        if (tokenData.error === "access_denied") {
          pollSpinner.fail("Authorization denied");
          return false;
        }

        if (tokenData.error === "expired_token") {
          pollSpinner.fail("Code expired");
          return false;
        }

        pollSpinner.fail("Authorization failed");
        return false;
      } catch {
        pollSpinner.fail("Network error");
        return false;
      }
    }

    pollSpinner.fail("Login timed out");
    return false;
  } catch {
    spinner.fail("Login failed");
    return false;
  }
}
