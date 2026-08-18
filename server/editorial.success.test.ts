import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "submissions/test-paper.pdf", url: "/manus-storage/submissions/test-paper.pdf" }),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    createSubmission: vi.fn().mockResolvedValue(101),
    createArticle: vi.fn().mockResolvedValue(404),
    getSubmissionById: vi.fn().mockResolvedValue({ id: 7, name: "Submitted Author", email: "author@example.com", title: "A Considered Paper", category: "Philosophy", abstract: "An abstract with enough length for the conversion contract to accept and create a draft article.", manuscriptUrl: "/manus-storage/submissions/paper.pdf", status: "reviewing", createdAt: new Date(), updatedAt: new Date() }),
    updateSubmissionStatus: vi.fn().mockResolvedValue(undefined),
    createForumThread: vi.fn().mockResolvedValue(202),
    createForumPost: vi.fn().mockResolvedValue(303),
  };
});

const { appRouter } = await import("./routers");
const dbMocks = await import("./db");

type TestUser = NonNullable<TrpcContext["user"]>;

function context(user: TestUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const admin: TestUser = {
  id: 1,
  openId: "admin-1",
  name: "Editor",
  email: "editor@example.com",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

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

  it("accepts a PDF payload through the upload contract", async () => {
    const pdfBytes = Buffer.from("%PDF-1.7 validation manuscript").toString("base64");
    await expect(appRouter.createCaller(context(null)).uploads.file({
      fileName: "validation-paper.pdf",
      contentType: "application/pdf",
      data: pdfBytes,
    })).resolves.toEqual({ key: "submissions/test-paper.pdf", url: "/manus-storage/submissions/test-paper.pdf" });
  });

  it("accepts a project storage path for an uploaded manuscript", async () => {
    await expect(appRouter.createCaller(context(null)).submissions.create({
      name: "Ananya Sen",
      email: "ananya@example.com",
      title: "The Ethics of an Open Question",
      category: "Philosophy",
      abstract: "This paper asks how unfinished questions can make room for shared inquiry.",
      manuscriptUrl: "/manus-storage/submissions/1730000000-paper.pdf",
    })).resolves.toEqual({ id: 101, success: true });
  });

  it("accepts an optional empty lead image when creating an article", async () => {
    await expect(appRouter.createCaller(context(admin)).admin.createArticle({
      slug: "a-new-paper",
      title: "A new paper from the desk",
      excerpt: "A sufficiently long catalogue excerpt for the article.",
      body: "This paper body contains enough text for the article creation contract.",
      authorName: "Editorial Desk",
      categoryId: 1,
      imageUrl: "",
      status: "draft",
    })).resolves.toEqual({ id: 404, success: true });
  });

  it("converts a reviewed submission into an editable draft article and preserves its manuscript PDF", async () => {
    await expect(appRouter.createCaller(context(admin)).admin.convertSubmission({
      id: 7,
      categoryId: 1,
      slug: "a-considered-paper-7",
    })).resolves.toEqual({ id: 404, success: true });
    expect(vi.mocked(dbMocks.createArticle)).toHaveBeenCalledWith(expect.objectContaining({
      manuscriptUrl: "/manus-storage/submissions/paper.pdf",
      status: "draft",
    }));
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
