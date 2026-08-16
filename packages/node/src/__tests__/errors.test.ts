import { describe, expect, it } from "vitest";
import {
  CommetAPIError,
  CommetError,
  CommetValidationError,
} from "../types/common";

describe("Error classes", () => {
  describe("CommetError", () => {
    it("sets message and name", () => {
      const error = new CommetError("something broke");
      expect(error.message).toBe("something broke");
      expect(error.name).toBe("CommetError");
      expect(error).toBeInstanceOf(Error);
    });

    it("carries optional code, statusCode, and details", () => {
      const error = new CommetError("fail", "ERR_CODE", 500, { key: "val" });
      expect(error.code).toBe("ERR_CODE");
      expect(error.statusCode).toBe(500);
      expect(error.details).toEqual({ key: "val" });
    });
  });

  describe("CommetAPIError", () => {
    it("sets statusCode and inherits from CommetError", () => {
      const error = new CommetAPIError("not found", 404, "not_found");
      expect(error.name).toBe("CommetAPIError");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("not_found");
      expect(error).toBeInstanceOf(CommetError);
      expect(error).toBeInstanceOf(Error);
    });

    it("carries details", () => {
      const details = { field: "email", reason: "invalid" };
      const error = new CommetAPIError(
        "bad request",
        400,
        "bad_request",
        details,
      );
      expect(error.details).toEqual(details);
    });

    it("serializes actionable diagnostics without a stack", () => {
      const error = new CommetAPIError(
        "Customer not found",
        404,
        "customer_not_found",
        { customerId: "cus_missing" },
        {
          type: "not_found_error",
          code: "customer_not_found",
          message: "Customer not found",
          param: "customerId",
          details: { customerId: "cus_missing" },
          doc_url:
            "https://commet.co/docs/api-reference/2026-07-31/errors/customer_not_found.md",
        },
        { requestId: "req_server_123", retryable: false },
      );

      expect(error.toJSON()).toEqual({
        name: "CommetAPIError",
        message: "Customer not found",
        type: "not_found_error",
        code: "customer_not_found",
        statusCode: 404,
        param: "customerId",
        details: { customerId: "cus_missing" },
        requestId: "req_server_123",
        retryable: false,
        docUrl:
          "https://commet.co/docs/api-reference/2026-07-31/errors/customer_not_found.md",
      });
      expect(JSON.stringify(error)).not.toContain("stack");
    });
  });

  describe("CommetValidationError", () => {
    it("stores field-level validation errors", () => {
      const fieldErrors = {
        email: ["is required", "must be valid"],
        name: ["is too short"],
      };

      const error = new CommetValidationError("Validation failed", fieldErrors);
      expect(error.name).toBe("CommetValidationError");
      expect(error.message).toBe("Validation failed");
      expect(error.validationErrors).toEqual(fieldErrors);
      expect(error).toBeInstanceOf(CommetError);
      expect(error).toBeInstanceOf(CommetAPIError);
    });
  });
});
