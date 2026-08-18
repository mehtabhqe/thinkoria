import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
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
} from "./db";

const storageReference = z.string().refine(
  value => value === "" || value.startsWith("/manus-storage/") || z.url().safeParse(value).success,
  "Expected an absolute URL or a project storage path",
);

const articleInput = z.object({
  slug: z.string().min(3).max(180),
  title: z.string().min(3).max(240),
  excerpt: z.string().min(10),
  body: z.string().min(20),
  authorName: z.string().min(2).max(180),
  categoryId: z.number().int().positive(),
  imageUrl: storageReference.optional(),
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
  submissions: router({
    create: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), title: z.string().min(3), category: z.string().min(2), abstract: z.string().min(20),     manuscriptUrl: storageReference.optional() })).mutation(({ input, ctx }) => createSubmission({ ...input, submitterId: ctx.user?.id ?? null, manuscriptUrl: input.manuscriptUrl || null }).then(id => ({ id, success: true }))),
  }),
  club: router({
    events: publicProcedure.query(() => listClubEvents()),
    join: protectedProcedure.mutation(({ ctx }) => joinClub(ctx.user.id).then(membership => ({ success: true, membership }))),
    submitApplication: protectedProcedure.input(z.object({ eventId: z.number().int().positive(), role: z.enum(["debator", "mediator", "jury", "timekeeper", "organizer", "observer", "other"]), otherRole: z.string().max(160).optional(), note: z.string().max(2000).optional() })).mutation(({ input, ctx }) => createClubApplication({ ...input, userId: ctx.user.id, otherRole: input.otherRole || null, note: input.note || null }).then(id => ({ id, success: true }))),
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
    updateSubmission: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["received", "reviewing", "accepted", "declined"]) })).mutation(({ input }) => updateSubmissionStatus(input.id, input.status).then(() => ({ success: true }))),
    convertSubmission: adminProcedure.input(z.object({ id: z.number().int().positive(), categoryId: z.number().int().positive(), slug: z.string().min(3).max(180), imageUrl: storageReference.optional() })).mutation(async ({ input }) => {
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
        manuscriptUrl: submission.manuscriptUrl || null,
        status: "draft",
        publishedAt: null,
      });
      await updateSubmissionStatus(input.id, "accepted");
      return { id: articleId, success: true };
    }),
    createArticle: adminProcedure.input(articleInput).mutation(({ input }) => createArticle({ ...input, imageUrl: input.imageUrl || null, manuscriptUrl: input.manuscriptUrl || null, publishedAt: input.status === "published" ? new Date() : null }).then(id => ({ id, success: true }))),
    updateArticle: adminProcedure.input(articleInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => { const { id, ...data } = input; return updateArticle(id, { ...data, imageUrl: data.imageUrl || null, manuscriptUrl: data.manuscriptUrl || null, publishedAt: data.status === "published" ? new Date() : null }).then(() => ({ success: true })); }),
    publishArticle: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(({ input }) => updateArticle(input.id, { status: input.status, publishedAt: input.status === "published" ? new Date() : null }).then(() => ({ success: true }))),
    deleteArticle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteArticle(input.id).then(() => ({ success: true }))),
    clubMembers: adminProcedure.query(() => listClubMembers()),
    clubApplications: adminProcedure.query(() => listClubApplications()),
    clubEvents: adminProcedure.query(() => listClubEvents()),
    createClubEvent: adminProcedure.input(z.object({ title: z.string().min(3).max(240), description: z.string().min(10), venue: z.string().min(2).max(240), eventDate: z.coerce.date(), registrationOpen: z.number().int().min(0).max(1).default(1) })).mutation(({ input }) => createClubEvent(input).then(id => ({ id, success: true }))),
    updateClubEvent: adminProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().min(3).max(240), description: z.string().min(10), venue: z.string().min(2).max(240), eventDate: z.coerce.date(), registrationOpen: z.number().int().min(0).max(1) })).mutation(({ input }) => { const { id, ...data } = input; return updateClubEvent(id, data).then(() => ({ success: true })); }),
    deleteClubEvent: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteClubEvent(input.id).then(() => ({ success: true }))),
    updateClubApplication: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "accepted", "declined", "waitlisted"]) })).mutation(({ input }) => updateClubApplicationStatus(input.id, input.status).then(() => ({ success: true }))),
  }),
});

export type AppRouter = typeof appRouter;
