import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";
import {
  createArticle,
  createClubApplication,
  createClubEvent,
  createForumPost,
  createForumThread,
  createSubmission,
  deleteArticle,
  deleteClubEvent,
  getArticleBySlug,
  incrementArticleView,
  joinClub,
  listClubApplications,
  listClubMembers,
  listAdminArticles,
  listAdminSubmissions,
  listCategories,
  listClubEvents,
  listForumPosts,
  listForumThreads,
  listPublishedArticles,
  updateArticle,
  updateClubApplicationStatus,
  updateClubEvent,
  updateSubmissionStatus,
  getSubmissionById,
  updateCategoryImage,
  getCategoryById,
  getArticleById,
  createCategoryImageVersion,
  listCategoryImageVersions,
  getCategoryImageVersion,
  createArticleAssetVersion,
  listArticleAssetVersions,
  getArticleAssetVersion,
  createNotificationHistory,
  listNotificationHistory,
  subscribeToNewsletter,
  hasEmailDelivery,
  recordEmailDelivery,
} from "./db";
import { clubMembershipEmail, debateApplicationEmail, newsletterEmail, sendTransactionalEmail, submissionDecisionEmail, submissionReceivedEmail } from "./email";

const storageReference = z.string().refine(
  value => value === "" || value.startsWith("/manus-storage/") || z.url().safeParse(value).success,
  "Expected an absolute URL or a project storage path",
);

async function sendEmailOnce(input: ReturnType<typeof newsletterEmail>) {
  try {
    if (await hasEmailDelivery(input.eventKey)) return;
    const result = await sendTransactionalEmail(input);
    await recordEmailDelivery({ eventKey: input.eventKey, kind: input.kind, recipient: input.to, status: result.sent ? "sent" : "failed", providerId: result.sent ? result.id : null });
  } catch (error) {
    console.warn("[Thinkoria] Transactional email skipped:", error);
    await recordEmailDelivery({ eventKey: input.eventKey, kind: input.kind, recipient: input.to, status: "failed" });
  }
}

async function sendSubmissionDecisionEmail(submission: { id: number; name: string; email: string; title: string }, status: "accepted" | "declined") {
  await sendEmailOnce(submissionDecisionEmail(submission.name, submission.email.trim().toLowerCase(), submission.title, status, `submission_decision:${submission.id}:${status}`));
}

async function notifyOwnerSafely(kind: string, payload: { title: string; content: string }) {
  let status: "sent" | "failed" = "failed";
  try {
    status = (await notifyOwner(payload)) ? "sent" : "failed";
  } catch (error) {
    console.warn("[Thinkoria] Owner notification skipped:", error);
  }
  try {
    await createNotificationHistory({ kind, title: payload.title, content: payload.content, status });
  } catch (error) {
    console.warn("[Thinkoria] Notification history could not be recorded:", error);
  }
  return status === "sent";
}

const articleInput = z.object({
  slug: z.string().min(3).max(180),
  title: z.string().min(3).max(240),
  excerpt: z.string().min(10),
  body: z.string().min(20),
  authorName: z.string().min(2).max(180),
  categoryId: z.number().int().positive(),
  imageUrl: storageReference.optional(),
  imageAlt: z.string().max(300).optional(),
  citations: z.string().max(12000).optional(),
  manuscriptUrl: storageReference.optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalogue: router({
    categories: publicProcedure.query(() => listCategories()),
    published: publicProcedure.input(z.object({ categorySlug: z.string().optional() }).optional()).query(({ input }) => listPublishedArticles(input?.categorySlug)),
    article: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getArticleBySlug(input.slug)),
    registerView: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => incrementArticleView(input.id).then(() => ({ success: true }))),
  }),
  uploads: router({
    file: publicProcedure.input(z.object({ fileName: z.string().min(1).max(180), contentType: z.string().min(3).max(120), data: z.string().min(1).max(14_000_000) })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.data, "base64");
      if (buffer.byteLength > 10 * 1024 * 1024) throw new Error("Files must be 10 MB or smaller");
      const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      return storagePut(`submissions/${Date.now()}-${safeFileName}`, buffer, input.contentType);
    }),
    adminImage: adminProcedure.input(z.object({ fileName: z.string().min(1).max(180), contentType: z.string().startsWith("image/"), data: z.string().min(1).max(14_000_000) })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.data, "base64");
      if (buffer.byteLength > 10 * 1024 * 1024) throw new Error("Images must be 10 MB or smaller");
      const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      return storagePut(`editorial/${Date.now()}-${safeFileName}`, buffer, input.contentType);
    }),
  }),
  newsletter: router({
    subscribe: publicProcedure.input(z.object({ email: z.string().trim().email().max(320) })).mutation(async ({ input }) => { const result = await subscribeToNewsletter(input.email); if (!result.alreadySubscribed) void sendEmailOnce(newsletterEmail(input.email.trim().toLowerCase(), `newsletter:${result.id}`)); return result; }),
  }),
  submissions: router({
    create: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), title: z.string().min(3), category: z.string().min(2), abstract: z.string().min(20), manuscriptUrl: storageReference.optional() })).mutation(async ({ input, ctx }) => { const id = await createSubmission({ ...input, submitterId: ctx.user?.id ?? null, manuscriptUrl: input.manuscriptUrl || null }); await notifyOwnerSafely("submission", { title: "New Thinkoria paper submission", content: `${input.title} was submitted by ${input.name} in ${input.category}. Contact: ${input.email}.` }); void sendEmailOnce(submissionReceivedEmail(input.name, input.email.trim().toLowerCase(), input.title, input.category, `submission_received:${id}`)); return { id, success: true }; }),
  }),
  club: router({
    events: publicProcedure.query(() => listClubEvents()),
    join: protectedProcedure.mutation(async ({ ctx }) => { const membership = await joinClub(ctx.user.id); if (ctx.user.email) void sendEmailOnce(clubMembershipEmail(ctx.user.name || "member", ctx.user.email, `club_membership:${ctx.user.id}`)); return { success: true, membership }; }),
    submitApplication: protectedProcedure.input(z.object({ eventId: z.number().int().positive().optional(), role: z.enum(["debator", "mediator", "jury", "timekeeper", "organizer", "observer", "other"]), otherRole: z.string().max(160).optional(), note: z.string().max(2000).optional() })).mutation(async ({ input, ctx }) => { const id = await createClubApplication({ ...input, userId: ctx.user.id, eventId: input.eventId ?? null, otherRole: input.otherRole || null, note: input.note || null }); await notifyOwnerSafely("club_application", { title: "New Nagaon Club application", content: `${ctx.user.name || ctx.user.email || "A member"} applied for the ${input.role} role${input.eventId ? ` for event #${input.eventId}` : ""}.` }); if (ctx.user.email) void sendEmailOnce(debateApplicationEmail(ctx.user.name || "member", ctx.user.email, input.role, `debate_application:${id}`)); return { id, success: true }; }),
  }),
  forum: router({
    threads: publicProcedure.query(() => listForumThreads()),
    posts: publicProcedure.input(z.object({ threadId: z.number().int().positive() })).query(({ input }) => listForumPosts(input.threadId)),
    createThread: protectedProcedure.input(z.object({ title: z.string().min(5).max(240), body: z.string().min(20), category: z.string().min(2) })).mutation(({ input, ctx }) => createForumThread({ ...input, authorId: ctx.user.id }).then(id => ({ id, success: true }))),
    createPost: protectedProcedure.input(z.object({ threadId: z.number().int().positive(), body: z.string().min(10).max(5000) })).mutation(({ input, ctx }) => createForumPost({ ...input, authorId: ctx.user.id }).then(id => ({ id, success: true }))),
  }),
  admin: router({
    articles: adminProcedure.query(() => listAdminArticles()),
    submissions: adminProcedure.query(() => listAdminSubmissions()),
    updateSubmission: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["received", "reviewing", "accepted", "declined"]) })).mutation(async ({ input }) => { const submission = await getSubmissionById(input.id); if (!submission) throw new Error("Submission not found"); await updateSubmissionStatus(input.id, input.status); if ((input.status === "accepted" || input.status === "declined") && submission.email) await sendSubmissionDecisionEmail(submission, input.status); return { success: true }; }),
    notifications: adminProcedure.query(() => listNotificationHistory()),
    categoryImageVersions: adminProcedure.input(z.object({ categoryId: z.number().int().positive() })).query(({ input }) => listCategoryImageVersions(input.categoryId)),
    articleAssetVersions: adminProcedure.input(z.object({ articleId: z.number().int().positive() })).query(({ input }) => listArticleAssetVersions(input.articleId)),
    updateCategoryImage: adminProcedure.input(z.object({ id: z.number().int().positive(), imageUrl: storageReference.nullable() })).mutation(async ({ input }) => { const current = await getCategoryById(input.id); await createCategoryImageVersion(input.id, current?.imageUrl ?? null); await updateCategoryImage(input.id, input.imageUrl || null); return { success: true }; }),
    restoreCategoryImage: adminProcedure.input(z.object({ versionId: z.number().int().positive() })).mutation(async ({ input }) => { const version = await getCategoryImageVersion(input.versionId); if (!version) throw new Error("Category image version not found"); const current = await getCategoryById(version.categoryId); await createCategoryImageVersion(version.categoryId, current?.imageUrl ?? null); await updateCategoryImage(version.categoryId, version.imageUrl || null); return { success: true }; }),
    convertSubmission: adminProcedure.input(z.object({ id: z.number().int().positive(), categoryId: z.number().int().positive(), slug: z.string().min(3).max(180), imageUrl: storageReference.optional(), imageAlt: z.string().max(300).optional() })).mutation(async ({ input }) => {
      const submission = await getSubmissionById(input.id);
      if (!submission) throw new Error("Submission not found");
      const articleId = await createArticle({
        slug: input.slug,
        title: submission.title,
        excerpt: submission.abstract,
        body: submission.abstract,
        authorName: submission.name,
        categoryId: input.categoryId,
        imageUrl: input.imageUrl || null,
        imageAlt: input.imageAlt || null,
        citations: null,
        manuscriptUrl: submission.manuscriptUrl || null,
        status: "draft",
        publishedAt: null,
      });
      await updateSubmissionStatus(input.id, "accepted");
      if (submission.email) await sendSubmissionDecisionEmail(submission, "accepted");
      return { id: articleId, success: true };
    }),
    createArticle: adminProcedure.input(articleInput).mutation(({ input }) => createArticle({ ...input, imageUrl: input.imageUrl || null, imageAlt: input.imageAlt || null, citations: input.citations || null, manuscriptUrl: input.manuscriptUrl || null, publishedAt: input.status === "published" ? new Date() : null }).then(id => ({ id, success: true }))),
    updateArticle: adminProcedure.input(articleInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...data } = input; const current = await getArticleById(id); await createArticleAssetVersion(id, current?.manuscriptUrl ?? null); await updateArticle(id, { ...data, imageUrl: data.imageUrl || null, imageAlt: data.imageAlt || null, citations: data.citations || null, manuscriptUrl: data.manuscriptUrl || null, publishedAt: data.status === "published" ? new Date() : null }); return { success: true }; }),
    restoreArticleAsset: adminProcedure.input(z.object({ versionId: z.number().int().positive() })).mutation(async ({ input }) => { const version = await getArticleAssetVersion(input.versionId); if (!version) throw new Error("Published PDF version not found"); const current = await getArticleById(version.articleId); await createArticleAssetVersion(version.articleId, current?.manuscriptUrl ?? null); await updateArticle(version.articleId, { manuscriptUrl: version.manuscriptUrl || null }); return { success: true }; }),
    publishArticle: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(({ input }) => updateArticle(input.id, { status: input.status, publishedAt: input.status === "published" ? new Date() : null }).then(() => ({ success: true }))),
    deleteArticle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteArticle(input.id).then(() => ({ success: true }))),
    clubMembers: adminProcedure.query(() => listClubMembers()),
    clubApplications: adminProcedure.query(() => listClubApplications()),
    clubEvents: adminProcedure.query(() => listClubEvents()),
    createClubEvent: adminProcedure.input(z.object({ title: z.string().min(3).max(240), description: z.string().min(10), venue: z.string().min(2).max(240), eventDate: z.coerce.date(), registrationOpen: z.number().int().min(0).max(1).default(1), imageUrl: storageReference.nullable().optional() })).mutation(({ input }) => createClubEvent({ ...input, imageUrl: input.imageUrl || null }).then(id => ({ id, success: true }))),
    updateClubEvent: adminProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().min(3).max(240), description: z.string().min(10), venue: z.string().min(2).max(240), eventDate: z.coerce.date(), registrationOpen: z.number().int().min(0).max(1), imageUrl: storageReference.nullable().optional() })).mutation(({ input }) => { const { id, ...data } = input; return updateClubEvent(id, { ...data, imageUrl: data.imageUrl || null }).then(() => ({ success: true })); }),
    deleteClubEvent: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteClubEvent(input.id).then(() => ({ success: true }))),
    updateClubApplication: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "accepted", "declined", "waitlisted"]) })).mutation(({ input }) => updateClubApplicationStatus(input.id, input.status).then(() => ({ success: true }))),
  }),
});

export type AppRouter = typeof appRouter;
