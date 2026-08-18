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

  it("requires authentication to reply in a forum thread", async () => {
    await expect(appRouter.createCaller(context(null)).forum.createPost({ threadId: 1, body: "A reply needs a little room for a considered point." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects invalid forum thread and reply payloads", async () => {
    const member = { id: 2, openId: "member", name: "Member", email: "member@example.com", role: "user" as const, loginMethod: "test", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
    await expect(appRouter.createCaller(context(member)).forum.createThread({ title: "tiny", body: "too short", category: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(appRouter.createCaller(context(member)).forum.createPost({ threadId: 0, body: "short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns public forum and club collections successfully when empty", async () => {
    await expect(appRouter.createCaller(context(null)).forum.threads()).resolves.toEqual([]);
    await expect(appRouter.createCaller(context(null)).club.events()).resolves.toEqual([]);
  }, 15_000);

  it("requires authentication to join the Nagaon club", async () => {
    await expect(appRouter.createCaller(context(null)).club.join()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks non-admin users from the editorial desk and submission review queue", async () => {
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
    await expect(appRouter.createCaller(context(user)).admin.submissions()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context(user)).admin.updateSubmission({ id: 1, status: "reviewing" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("protects editorial lead-image uploads from anonymous and member accounts", async () => {
    const imageInput = { fileName: "lead.jpg", contentType: "image/jpeg", data: "dGVzdA==" };
    await expect(appRouter.createCaller(context(null)).uploads.adminImage(imageInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
    const member: TestUser = { id: 6, openId: "reader-6", name: "Reader Six", email: "reader6@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
    await expect(appRouter.createCaller(context(member)).uploads.adminImage(imageInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
