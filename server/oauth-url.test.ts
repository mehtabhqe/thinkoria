import { afterEach, describe, expect, it } from "vitest";
import { buildOAuthLoginUrl, MANUS_OAUTH_PORTAL_URL, THINKORIA_APP_ID } from "../client/src/const";
import { MANUS_APP_URL, isPublicMirror, publicOrManusHref } from "../client/src/lib/manusHandoff";
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

describe("custom-domain Manus handoff", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    else Reflect.deleteProperty(globalThis, "window");
  });

  it("hands protected routes to Manus from the canonical custom domain", () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { hostname: "www.thinkoria.space" } },
    });

    expect(isPublicMirror()).toBe(true);
    expect(publicOrManusHref("/forum")).toBe(`${MANUS_APP_URL}/forum`);
    expect(publicOrManusHref("/admin")).toBe(`${MANUS_APP_URL}/admin`);
    expect(`${MANUS_APP_URL}/auth/login`).toBe("https://commonindex-ogwzsusn.manus.space/auth/login");
  });
});
