import type {
  ApiResponse,
  Currency,
  CustomerID,
  ListParams,
  RequestOptions,
  RetrieveOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Customer {
  id: CustomerID;
  organizationId: string;
  externalId?: string;
  legalName: string;
  displayName?: string;
  domain?: string;
  website?: string;
  taxStatus: "TAXED" | "TAX_EXEMPT" | "REVERSE_CHARGE" | "NOT_APPLICABLE";
  currency: Currency;
  addressId: string;
  billingEmail?: string;
  paymentTerms?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Base fields shared by all customer creation scenarios
interface CreateCustomerBaseParams {
  externalId?: string;
  legalName: string;
  displayName?: string;
  domain?: string;
  website?: string;
  currency?: Currency;
  billingEmail?: string;
  paymentTerms?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
}

// Address structure
export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string; // ISO-2
  region?: string;
}

// When taxStatus is TAXED, address is required
interface CreateCustomerTaxed extends CreateCustomerBaseParams {
  taxStatus: "TAXED";
  address: CustomerAddress;
}

// For other tax statuses, address is optional
interface CreateCustomerOtherTaxStatus extends CreateCustomerBaseParams {
  taxStatus?: "TAX_EXEMPT" | "REVERSE_CHARGE" | "NOT_APPLICABLE";
  address?: CustomerAddress;
}

// Union type that enforces the constraint
export type CreateCustomerParams =
  | CreateCustomerTaxed
  | CreateCustomerOtherTaxStatus;

export interface UpdateCustomerParams {
  externalId?: string;
  legalName?: string;
  displayName?: string;
  domain?: string;
  website?: string;
  taxStatus?: "TAXED" | "TAX_EXEMPT" | "REVERSE_CHARGE" | "NOT_APPLICABLE";
  currency?: Currency;
  billingEmail?: string;
  paymentTerms?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

export interface ListCustomersParams extends ListParams {
  externalId?: string;
  taxStatus?: "TAXED" | "TAX_EXEMPT" | "REVERSE_CHARGE" | "NOT_APPLICABLE";
  currency?: Currency;
  isActive?: boolean;
  search?: string;
}

/**
 * Customer resource for managing customer data
 */
export class CustomersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async create(
    params: CreateCustomerParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.post("/customers", params, options);
  }

  async get(
    customerId: CustomerID,
    options?: RetrieveOptions,
  ): Promise<ApiResponse<Customer>> {
    const params = options?.expand
      ? { expand: options.expand.join(",") }
      : undefined;
    return this.httpClient.get(`/customers/${customerId}`, params);
  }

  async update(
    customerId: CustomerID,
    params: UpdateCustomerParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.put(`/customers/${customerId}`, params, options);
  }

  async list(params?: ListCustomersParams): Promise<ApiResponse<Customer[]>> {
    return this.httpClient.get("/customers", params);
  }

  /**
   * Deactivate a customer (soft delete)
   */
  async deactivate(
    customerId: CustomerID,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.put(
      `/customers/${customerId}`,
      { isActive: false },
      options,
    );
  }
}
