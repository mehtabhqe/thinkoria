import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type TestUser = NonNullable<TrpcContext["user"]>;

function context(user: TestUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("editorial platform permissions", () => {
  it("exposes the current public session", async () => {
    const user: TestUser = {
      id: 4,
      openId: "reader-4",
      name: "Reader Four",
      email: "reader@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    await expect(appRouter.createCaller(context(user)).auth.me()).resolves.toMatchObject({ openId: "reader-4" });
  });

  it("rejects malformed public submissions before touching the database", async () => {
    await expect(appRouter.createCaller(context(null)).submissions.create({ name: "A", email: "not-an-email", title: "x", category: "Philosophy", abstract: "short", manuscriptUrl: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires authentication to start a forum thread", async () => {
    await expect(appRouter.createCaller(context(null)).forum.createThread({ title: "A serious question", body: "This question needs at least a little more room to be considered.", category: "Philosophy" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns public forum and club collections successfully when empty", async () => {
    await expect(appRouter.createCaller(context(null)).forum.threads()).resolves.toEqual([]);
    await expect(appRouter.createCaller(context(null)).club.events()).resolves.toEqual([]);
  });

  it("requires authentication to join the Nagaon club", async () => {
    await expect(appRouter.createCaller(context(null)).club.join()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks non-admin users from the editorial desk", async () => {
    const user: TestUser = {
      id: 5,
      openId: "reader-5",
      name: "Reader Five",
      email: "reader5@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    await expect(appRouter.createCaller(context(user)).admin.articles()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
