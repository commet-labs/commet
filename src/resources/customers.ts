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

export interface CreateCustomerParams {
  legalName: string;
  displayName?: string;
  domain?: string;
  website?: string;
  taxStatus?: "TAXED" | "TAX_EXEMPT" | "REVERSE_CHARGE" | "NOT_APPLICABLE";
  currency?: Currency;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string; // ISO-2
    region?: string;
  };
  billingEmail?: string;
  paymentTerms?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerParams {
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

  async retrieve(
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
