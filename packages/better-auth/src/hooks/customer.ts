import type { GenericEndpointContext, User } from "better-auth";
import { APIError } from "better-auth/api";
import type { CommetOptions } from "../types";

/**
 * Hook called before a user is created in Better Auth
 * Creates a Commet customer if createCustomerOnSignUp is enabled
 */
export const onBeforeUserCreate =
  (options: CommetOptions) =>
  async (user: Partial<User>, context: GenericEndpointContext | null) => {
    if (!context || !options.createCustomerOnSignUp) {
      return;
    }

    try {
      const customParams = options.getCustomerCreateParams
        ? await options.getCustomerCreateParams({ user }, context.request)
        : {};

      if (!user.email) {
        throw new APIError("BAD_REQUEST", {
          message: "An email is required to create a customer",
        });
      }

      // Check if customer already exists by email
      const existingCustomers = await options.client.customers.list({
        search: user.email,
      });

      const existingCustomer = existingCustomers.data?.find(
        (c) => c.billingEmail === user.email
      );

      // Skip creation if customer already exists
      if (!existingCustomer) {
        await options.client.customers.create({
          email: user.email,
          fullName: customParams.fullName ?? user.name,
          domain: customParams.domain,
          metadata: customParams.metadata,
        });
      }
    } catch (e: unknown) {
      if (e instanceof APIError) {
        throw e;
      }

      if (e instanceof Error) {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: `Commet customer creation failed: ${e.message}`,
        });
      }

      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Commet customer creation failed",
      });
    }
  };

/**
 * Hook called after a user is created in Better Auth
 * Updates the Commet customer with the externalId (Better Auth user ID)
 */
export const onAfterUserCreate =
  (options: CommetOptions) =>
  async (user: User, context: GenericEndpointContext | null) => {
    if (!context || !options.createCustomerOnSignUp) {
      return;
    }

    try {
      // Find customer by email and update with externalId
      const existingCustomers = await options.client.customers.list({
        search: user.email,
      });

      const existingCustomer = existingCustomers.data?.find(
        (c) => c.billingEmail === user.email
      );

      if (existingCustomer && existingCustomer.externalId !== user.id) {
        await options.client.customers.update({
          customerId: existingCustomer.id,
          externalId: user.id,
        });
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: `Commet customer update failed: ${e.message}`,
        });
      }

      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Commet customer update failed",
      });
    }
  };

/**
 * Hook called when a user is updated in Better Auth
 * Syncs email and name changes to the Commet customer
 */
export const onUserUpdate =
  (options: CommetOptions) =>
  async (user: User, context: GenericEndpointContext | null) => {
    if (!context || !options.createCustomerOnSignUp) {
      return;
    }

    try {
      // Find customer by externalId and update
      const existingCustomers = await options.client.customers.list({
        externalId: user.id,
      });

      const existingCustomer = existingCustomers.data?.[0];

      if (existingCustomer) {
        await options.client.customers.update({
          customerId: existingCustomer.id,
          email: user.email,
          fullName: user.name ?? undefined,
        });
      }
    } catch (e: unknown) {
      // Log but don't throw - update failures shouldn't break the auth flow
      if (e instanceof Error) {
        context.context.logger.error(
          `Commet customer update failed: ${e.message}`
        );
      } else {
        context.context.logger.error("Commet customer update failed");
      }
    }
  };

/**
 * Hook called when a user is deleted in Better Auth
 * Archives the corresponding Commet customer
 */
export const onUserDelete =
  (options: CommetOptions) =>
  async (user: User, context: GenericEndpointContext | null) => {
    if (!context || !options.createCustomerOnSignUp) {
      return;
    }

    try {
      // Find customer by externalId and archive
      const existingCustomers = await options.client.customers.list({
        externalId: user.id,
      });

      const existingCustomer = existingCustomers.data?.[0];

      if (existingCustomer) {
        await options.client.customers.archive(existingCustomer.id);
      }
    } catch (e: unknown) {
      // Log but don't throw - archive failures shouldn't break the auth flow
      if (e instanceof Error) {
        context?.context.logger.error(
          `Commet customer archive failed: ${e.message}`
        );
      } else {
        context?.context.logger.error("Commet customer archive failed");
      }
    }
  };
