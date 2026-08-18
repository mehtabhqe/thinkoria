import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    createSubmission: vi.fn().mockResolvedValue(101),
    createForumThread: vi.fn().mockResolvedValue(202),
    createForumPost: vi.fn().mockResolvedValue(303),
  };
});

const { appRouter } = await import("./routers");

type TestUser = NonNullable<TrpcContext["user"]>;

function context(user: TestUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const member: TestUser = {
  id: 8,
  openId: "member-8",
  name: "Member Eight",
  email: "member8@example.com",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("editorial success contracts", () => {
  it("creates a valid submission", async () => {
    await expect(appRouter.createCaller(context(null)).submissions.create({
      name: "Ananya Sen",
      email: "ananya@example.com",
      title: "The Ethics of an Open Question",
      category: "Philosophy",
      abstract: "This paper asks how unfinished questions can make room for shared inquiry.",
      manuscriptUrl: "",
    })).resolves.toEqual({ id: 101, success: true });
  });

  it("creates a forum thread for an authenticated member", async () => {
    await expect(appRouter.createCaller(context(member)).forum.createThread({
      title: "A question about unfinished work",
      body: "How might we keep a thought open without losing the responsibility to make an argument?",
      category: "Philosophy",
    })).resolves.toEqual({ id: 202, success: true });
  });

  it("creates a forum reply for an authenticated member", async () => {
    await expect(appRouter.createCaller(context(member)).forum.createPost({
      threadId: 202,
      body: "The unfinished question may be where responsibility begins, rather than where it ends.",
    })).resolves.toEqual({ id: 303, success: true });
  });
});
