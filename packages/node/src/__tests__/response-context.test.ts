import { describe, expect, it } from "vitest";
import { readResponseContext } from "../utils/http";

describe("readResponseContext", () => {
  it("preserves the exact server request ID", () => {
    expect(
      readResponseContext(new Headers({ "x-request-id": "req_server_123" })),
    ).toEqual({ requestId: "req_server_123" });
  });

  it("does not fabricate a request ID", () => {
    expect(readResponseContext(new Headers())).toEqual({
      requestId: undefined,
    });
  });
});
