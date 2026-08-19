import { describe, expect, it } from "vitest";
import { buildOAuthLoginUrl, MANUS_OAUTH_PORTAL_URL, THINKORIA_APP_ID } from "../client/src/const";
import { decodeOAuthState } from "../shared/const";

describe("custom-domain OAuth login URL", () => {
  it("uses the active thinkoria.space origin for the callback", () => {
    const result = buildOAuthLoginUrl({
      origin: "https://www.thinkoria.space/",
      nonce: "test-nonce",
    });
    const url = new URL(result.url);

    expect(url.origin).toBe(MANUS_OAUTH_PORTAL_URL);
    expect(url.pathname).toBe("/app-auth");
    expect(url.searchParams.get("appId")).toBe(THINKORIA_APP_ID);
    expect(url.searchParams.get("redirectUri")).toBe(
      "https://www.thinkoria.space/api/oauth/callback",
    );
    expect(decodeOAuthState(url.searchParams.get("state") ?? "")).toEqual({
      redirectUri: "https://www.thinkoria.space/api/oauth/callback",
      nonce: "test-nonce",
    });
    expect(url.searchParams.get("type")).toBe("signIn");
  });
});
