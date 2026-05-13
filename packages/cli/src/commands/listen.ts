import Ably from "ably";
import chalk from "chalk";
import { Command } from "commander";
import { apiRequest, BASE_URL } from "../utils/api";
import { loadAuth, loadProjectConfig } from "../utils/config";

interface ListenStartResponse {
  sessionId: string;
  channelName: string;
  tokenRequest: Ably.TokenRequest;
}

interface ListenOptions {
  port: string;
  events?: string;
  path: string;
}

type EventLineSuccess = { event: string; statusCode: number; ms: number };
type EventLineError = { event: string; error: string; ms: number };

function printEventLine(line: EventLineSuccess | EventLineError) {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  const eventName = chalk.yellow(line.event.padEnd(28));
  const timing = chalk.dim(`(${line.ms}ms)`);

  if ("error" in line) {
    console.log(
      `  ${chalk.dim(time)}  ${eventName} →  ${chalk.red("Error")}    ${timing}`,
    );
    console.log(`  ${" ".repeat(12)}${chalk.red(line.error)}`);
    return;
  }

  const status =
    line.statusCode < 400
      ? chalk.green(`${line.statusCode} OK`)
      : chalk.red(`${line.statusCode} Error`);

  console.log(
    `  ${chalk.dim(time)}  ${eventName} →  ${status}  ${timing}`,
  );
}

function isWebhookMessage(
  data: unknown,
): data is { event: string; timestamp: string; data: unknown } {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.event === "string" &&
    typeof obj.timestamp === "string" &&
    "data" in obj
  );
}

export const listenCommand = new Command("listen")
  .description("Forward webhook events to your local server")
  .requiredOption("--port <number>", "Local port to forward to")
  .option("--events <types>", "Comma-separated event types to filter")
  .option("--path <path>", "Path within localhost", "/")
  .action(async (options: ListenOptions) => {
    const auth = loadAuth();
    if (!auth) {
      console.log(chalk.red("Not authenticated. Run: commet login"));
      process.exit(1);
    }

    const projectConfig = loadProjectConfig();
    if (!projectConfig) {
      console.log(chalk.red("No project linked. Run: commet link"));
      process.exit(1);
    }

    const port = Number(options.port);
    if (Number.isNaN(port) || port <= 0 || port > 65535) {
      console.log(chalk.red("Invalid port number"));
      process.exit(1);
    }

    async function fetchTokenRequest(): Promise<{
      sessionId: string;
      channelName: string;
      tokenRequest: Ably.TokenRequest;
    }> {
      const result = await apiRequest<ListenStartResponse>(
        `${BASE_URL}/api/cli/listen/start`,
        {
          method: "POST",
          body: JSON.stringify({ organizationId: projectConfig!.orgId }),
        },
      );

      if (result.error || !result.data) {
        console.log(chalk.red("Failed to start listen session"));
        if (result.error) {
          console.log(chalk.dim(result.error));
        }
        process.exit(1);
      }

      return result.data;
    }

    const initialSession = await fetchTokenRequest();
    const { sessionId, channelName } = initialSession;

    const ably = new Ably.Realtime({
      authCallback: async (_tokenParams, callback) => {
        try {
          const refreshed = await fetchTokenRequest();
          callback(null, refreshed.tokenRequest);
        } catch (error) {
          callback(
            error instanceof Error ? error : new Error("Token refresh failed"),
            null,
          );
        }
      },
    });

    let wasConnected = false;

    ably.connection.on("connected", () => {
      if (wasConnected) {
        console.log(chalk.green("  ✓ Reconnected"));
      }
      wasConnected = true;
    });

    ably.connection.on("disconnected", () => {
      console.log(chalk.yellow("\n  ⚠ Disconnected. Reconnecting..."));
    });

    ably.connection.on("failed", () => {
      console.log(
        chalk.red("\n  ✗ Connection failed. Check your authentication."),
      );
      process.exit(1);
    });

    const channel = ably.channels.get(channelName);

    const targetUrl = `http://localhost:${port}${options.path}`;

    console.log("");
    console.log(
      chalk.green(`  ✓ Authenticated (org: ${projectConfig.orgName})`),
    );
    console.log(chalk.green("  ✓ Connected to Commet webhook stream"));
    console.log(chalk.cyan(`  ⟶ Forwarding to ${targetUrl}`));
    console.log("");
    console.log("  Ready! Listening for webhook events...");
    console.log("");

    const eventFilter = options.events
      ?.split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    channel.subscribe((message: Ably.Message) => {
      if (!isWebhookMessage(message.data)) return;

      const { event, timestamp, data } = message.data;

      if (eventFilter && !eventFilter.includes(event)) return;

      const start = performance.now();

      fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Commet-Event": event,
          "X-Commet-Timestamp": timestamp,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          const ms = Math.round(performance.now() - start);
          printEventLine({ event, statusCode: response.status, ms });
        })
        .catch((error) => {
          const ms = Math.round(performance.now() - start);
          printEventLine({
            event,
            error: error instanceof Error ? error.message : "Unknown error",
            ms,
          });
        });
    });

    let isShuttingDown = false;

    process.on("SIGINT", async () => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(chalk.dim("\n  Disconnecting..."));

      ably.close();

      await apiRequest(`${BASE_URL}/api/cli/listen/stop`, {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      process.exit(0);
    });
  });
