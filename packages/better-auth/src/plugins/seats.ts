import type { Commet } from "@commet/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint } from "better-auth/plugins";
import { z } from "zod";

export interface SeatsConfig {
  // Reserved for future configuration options
}

const SeatOperationSchema = z.object({
  seatType: z.string(),
  count: z.number().min(1),
});

const SetAllSeatsSchema = z.object({
  seats: z.record(z.string(), z.number()),
});

/**
 * Seats plugin - Manage seat-based licensing
 *
 * Endpoints:
 * - GET /seats - List all seat balances for the authenticated user
 * - POST /seats/add - Add seats of a specific type
 * - POST /seats/remove - Remove seats of a specific type
 * - POST /seats/set - Set seats to a specific count
 * - POST /seats/set-all - Set all seat types at once
 */
export const seats =
  (_config: SeatsConfig = {}) =>
  (commet: Commet) => {
    return {
      listSeats: createAuthEndpoint(
        "/seats",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to view seats",
            });
          }

          try {
            const result = await commet.seats.getAllBalances({
              externalId: userId,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to list seats",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet seats list failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to list seats",
            });
          }
        },
      ),

      addSeats: createAuthEndpoint(
        "/seats/add",
        {
          method: "POST",
          body: SeatOperationSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to add seats",
            });
          }

          try {
            const result = await commet.seats.add(
              {
                externalId: userId,
                seatType: ctx.body.seatType,
                count: ctx.body.count,
              },
              {},
            );

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to add seats",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(`Commet seats add failed: ${e.message}`);
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to add seats",
            });
          }
        },
      ),

      removeSeats: createAuthEndpoint(
        "/seats/remove",
        {
          method: "POST",
          body: SeatOperationSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to remove seats",
            });
          }

          try {
            const result = await commet.seats.remove(
              {
                externalId: userId,
                seatType: ctx.body.seatType,
                count: ctx.body.count,
              },
              {},
            );

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to remove seats",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet seats remove failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to remove seats",
            });
          }
        },
      ),

      setSeats: createAuthEndpoint(
        "/seats/set",
        {
          method: "POST",
          body: SeatOperationSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to set seats",
            });
          }

          try {
            const result = await commet.seats.set(
              {
                externalId: userId,
                seatType: ctx.body.seatType,
                count: ctx.body.count,
              },
              {},
            );

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to set seats",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(`Commet seats set failed: ${e.message}`);
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to set seats",
            });
          }
        },
      ),

      setAllSeats: createAuthEndpoint(
        "/seats/set-all",
        {
          method: "POST",
          body: SetAllSeatsSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to set seats",
            });
          }

          try {
            const result = await commet.seats.setAll(
              {
                externalId: userId,
                seats: ctx.body.seats,
              },
              {},
            );

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to set all seats",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet seats set-all failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to set all seats",
            });
          }
        },
      ),
    };
  };
