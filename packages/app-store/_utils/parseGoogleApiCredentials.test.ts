import { afterEach, describe, expect, it } from "vitest";

import { getOffice365AppKeysFromEnv, parseGoogleApiCredentialsFromEnv } from "./parseGoogleApiCredentials";

describe("parseGoogleApiCredentialsFromEnv", () => {
  const original = process.env.GOOGLE_API_CREDENTIALS;

  afterEach(() => {
    process.env.GOOGLE_API_CREDENTIALS = original;
  });

  it("returns null when env is missing", () => {
    delete process.env.GOOGLE_API_CREDENTIALS;
    expect(parseGoogleApiCredentialsFromEnv()).toBeNull();
  });

  it("parses valid Google credentials JSON", () => {
    process.env.GOOGLE_API_CREDENTIALS = JSON.stringify({
      web: {
        client_id: "id",
        client_secret: "secret",
        redirect_uris: ["https://example.com/callback"],
      },
    });

    expect(parseGoogleApiCredentialsFromEnv()).toEqual({
      client_id: "id",
      client_secret: "secret",
      redirect_uris: ["https://example.com/callback"],
    });
  });
});

describe("getOffice365AppKeysFromEnv", () => {
  const originalId = process.env.MS_GRAPH_CLIENT_ID;
  const originalSecret = process.env.MS_GRAPH_CLIENT_SECRET;

  afterEach(() => {
    process.env.MS_GRAPH_CLIENT_ID = originalId;
    process.env.MS_GRAPH_CLIENT_SECRET = originalSecret;
  });

  it("returns null when env is incomplete", () => {
    delete process.env.MS_GRAPH_CLIENT_ID;
    delete process.env.MS_GRAPH_CLIENT_SECRET;
    expect(getOffice365AppKeysFromEnv()).toBeNull();
  });

  it("returns keys when env is set", () => {
    process.env.MS_GRAPH_CLIENT_ID = "client-id";
    process.env.MS_GRAPH_CLIENT_SECRET = "client-secret";

    expect(getOffice365AppKeysFromEnv()).toEqual({
      client_id: "client-id",
      client_secret: "client-secret",
    });
  });
});
