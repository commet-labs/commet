import Ably from "ably";
import chalk from "chalk";
import { Command } from "commander";
import { apiRequest, BASE_URL } from "../utils/api";
import { loadProjectConfig } from "../utils/config";
import { exitWithError, requireOrgContext } from "../utils/output";

interface ListenStartResponse {
  sessionId: string;
  channelName: string;
  signingSecret: string;
  tokenRequest: Ably.TokenRequest;
}

interface ListenRefreshResponse {
  tokenRequest: Ably.TokenRequest;
}

interface ListenOptions {
  events?: string;
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

  console.log(`  ${chalk.dim(time)}  ${eventName} →  ${status}  ${timing}`);
}

interface ListenMessage {
  payload: Record<string, unknown>;
  headers: Record<string, string>;
}

function isListenMessage(data: unknown): data is ListenMessage {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.payload === "object" &&
    obj.payload !== null &&
    typeof obj.headers === "object" &&
    obj.headers !== null
  );
}

function resolveTargetUrl(input: string): string {
  if (/^\d+$/.test(input)) {
    return `http://localhost:${input}/`;
  }

  const hasProtocol =
    input.startsWith("http://") || input.startsWith("https://");
  const parsed = new URL(hasProtocol ? input : `http://${input}`);

  if (!hasProtocol && !parsed.port) {
    throw new Error(
      `Missing port in "${input}". Pass a port (commet listen localhost:3000/webhooks) or a full URL (commet listen https://app.localhost/webhooks).`,
    );
  }

  if (!parsed.pathname.endsWith("/")) {
    parsed.pathname += "/";
  }

  return parsed.toString();
}

export const listenCommand = new Command("listen")
  .description(
    "Forward webhook events from Commet to your local server in real time. Opens a persistent connection and replays every event as an HTTP POST to your URL.",
  )
  .argument(
    "<url>",
    "Target URL — a port (3000), host:port (localhost:3000), or full URL",
  )
  .option(
    "--events <types>",
    "Only forward these event types (comma-separated)",
  )
  .addHelpText(
    "after",
    `
Examples:
  $ commet listen 3000                          Forward to http://localhost:3000/
  $ commet listen localhost:3000/webhooks        Forward to a specific path
  $ commet listen 3000 --events invoice.paid     Only forward invoice.paid events
`,
  )
  .action(async (url: string, options: ListenOptions) => {
    const { orgId } = requireOrgContext();

    let targetUrl: string;
    try {
      targetUrl = resolveTargetUrl(url);
    } catch (error) {
      exitWithError({
        code: "invalid_url",
        message: error instanceof Error ? error.message : "Invalid URL",
      });
    }

    const projectConfig = loadProjectConfig();
    const organizationId = orgId === "__from_api_key__" ? undefined : orgId;
    const orgName = projectConfig?.orgName ?? "API key";

    const startResult = await apiRequest<ListenStartResponse>(
      `${BASE_URL}/api/cli/listen/start`,
      {
        method: "POST",
        body: JSON.stringify({
          ...(organizationId ? { organizationId } : {}),
        }),
      },
    );

    if (startResult.error || !startResult.data) {
      const sessionExpired = startResult.error?.code === "http_401";
      exitWithError({
        code: startResult.error?.code ?? "listen_failed",
        message: sessionExpired
          ? "Your session expired"
          : (startResult.error?.message ?? "Failed to start listen session"),
        action: sessionExpired ? "commet login" : undefined,
      });
    }

    const { sessionId, channelName, signingSecret, tokenRequest } =
      startResult.data;

    let isFirstToken = true;

    const ably = new Ably.Realtime({
      authCallback: async (_tokenParams, callback) => {
        try {
          if (isFirstToken) {
            isFirstToken = false;
            callback(null, tokenRequest);
            return;
          }
          const refreshResult = await apiRequest<ListenRefreshResponse>(
            `${BASE_URL}/api/cli/listen/refresh`,
            {
              method: "POST",
              body: JSON.stringify({
                sessionId,
                ...(organizationId ? { organizationId } : {}),
              }),
            },
          );

          if (refreshResult.error || !refreshResult.data) {
            throw new Error("Failed to refresh token");
          }

          callback(null, refreshResult.data.tokenRequest);
        } catch (error) {
          callback(
            error instanceof Error ? error.message : "Token refresh failed",
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

    console.log("");
    console.log(chalk.green(`  ✓ Authenticated (org: ${orgName})`));
    console.log(chalk.green("  ✓ Connected to Commet webhook stream"));
    console.log(chalk.cyan(`  ⟶ Forwarding to ${targetUrl}`));
    console.log(chalk.dim(`  ⟶ Signing secret: ${signingSecret}`));
    console.log("");
    console.log("  Ready! Listening for webhook events...");
    console.log("");

    const eventFilter = options.events
      ?.split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    channel.subscribe((message: Ably.Message) => {
      if (!message.name || !isListenMessage(message.data)) return;

      const event = message.name;
      const { payload, headers } = message.data;

      if (eventFilter && !eventFilter.includes(event)) return;

      const start = performance.now();

      fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
        .then((response) => {
          const ms = Math.round(performance.now() - start);
          printEventLine({
            event,
            statusCode: response.status,
            ms,
          });
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
        body: JSON.stringify({
          sessionId,
          ...(organizationId ? { organizationId } : {}),
        }),
      });

      process.exit(0);
    });
  });
