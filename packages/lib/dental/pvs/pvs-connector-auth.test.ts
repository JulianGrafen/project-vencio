import { describe, expect, it, beforeEach, afterEach } from "vitest";

import {
  PvsConnectorAuthError,
  assertPvsConnectorAuthorized,
  resolvePvsConnectorApiKey,
} from "./pvs-connector-auth";

describe("pvs-connector-auth", () => {
  const originalKey = process.env.PVS_CONNECTOR_API_KEY;

  beforeEach(() => {
    process.env.PVS_CONNECTOR_API_KEY = "secret-connector-key";
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.PVS_CONNECTOR_API_KEY;
    } else {
      process.env.PVS_CONNECTOR_API_KEY = originalKey;
    }
  });

  it("resolves configured API key", () => {
    expect(resolvePvsConnectorApiKey()).toBe("secret-connector-key");
  });

  it("accepts bearer token", () => {
    expect(() => assertPvsConnectorAuthorized("Bearer secret-connector-key")).not.toThrow();
  });

  it("rejects invalid token", () => {
    expect(() => assertPvsConnectorAuthorized("Bearer wrong")).toThrow(PvsConnectorAuthError);
  });

  it("rejects when connector API is not configured", () => {
    delete process.env.PVS_CONNECTOR_API_KEY;
    expect(() => assertPvsConnectorAuthorized("Bearer secret-connector-key")).toThrow(
      PvsConnectorAuthError
    );
  });
});
