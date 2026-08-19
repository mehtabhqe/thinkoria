import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });
});

describe("custom-domain session management", () => {
  it("returns the current authenticated session through auth.me", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.auth.me()).resolves.toMatchObject({
      openId: "sample-user",
      email: "sample@example.com",
      role: "user",
    });
  });

  it("uses secure host-only session clearing behind an HTTPS proxy", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    ctx.req.headers = { "x-forwarded-proto": "https" };
    const caller = appRouter.createCaller(ctx);

    await caller.auth.logout();

    expect(clearedCookies[0]?.options).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: -1,
    });
    expect(clearedCookies[0]?.options).not.toHaveProperty("domain");
  });

  it("keeps logout idempotent when the session has already expired", async () => {
    const ctx = {
      user: null,
      req: { protocol: "https", headers: {} },
      res: { clearCookie: () => undefined },
    } as unknown as TrpcContext;
    const caller = appRouter.createCaller(ctx);

    await expect(caller.auth.logout()).resolves.toEqual({ success: true });
    await expect(caller.auth.me()).resolves.toBeNull();
  });

  it("denies protected Editorial Desk and Forum operations without a session", async () => {
    const ctx = {
      user: null,
      req: { protocol: "https", headers: {} },
      res: { clearCookie: () => undefined },
    } as unknown as TrpcContext;
    const caller = appRouter.createCaller(ctx);

    await expect(caller.forum.createThread({ title: "A protected topic", body: "This should not be created anonymously.", category: "Philosophy" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.admin.articles()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
