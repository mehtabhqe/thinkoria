import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createArticle,
  createForumThread,
  createSubmission,
  deleteArticle,
  getArticleBySlug,
  incrementArticleView,
  joinClub,
  listAdminArticles,
  listCategories,
  listClubEvents,
  listForumThreads,
  listPublishedArticles,
  updateArticle,
} from "./db";

const articleInput = z.object({
  slug: z.string().min(3).max(180),
  title: z.string().min(3).max(240),
  excerpt: z.string().min(10),
  body: z.string().min(20),
  authorName: z.string().min(2).max(180),
  categoryId: z.number().int().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
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
      return storagePut(`submissions/${input.fileName}`, buffer, input.contentType);
    }),
  }),
  submissions: router({
    create: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), title: z.string().min(3), category: z.string().min(2), abstract: z.string().min(20), manuscriptUrl: z.string().url().optional().or(z.literal("")) })).mutation(({ input, ctx }) => createSubmission({ ...input, submitterId: ctx.user?.id ?? null, manuscriptUrl: input.manuscriptUrl || null }).then(id => ({ id, success: true }))),
  }),
  club: router({
    events: publicProcedure.query(() => listClubEvents()),
    join: protectedProcedure.mutation(({ ctx }) => joinClub(ctx.user.id).then(membership => ({ success: true, membership }))),
  }),
  forum: router({
    threads: publicProcedure.query(() => listForumThreads()),
    createThread: protectedProcedure.input(z.object({ title: z.string().min(5).max(240), body: z.string().min(20), category: z.string().min(2) })).mutation(({ input, ctx }) => createForumThread({ ...input, authorId: ctx.user.id }).then(id => ({ id, success: true }))),
  }),
  admin: router({
    articles: adminProcedure.query(() => listAdminArticles()),
    createArticle: adminProcedure.input(articleInput).mutation(({ input }) => createArticle({ ...input, imageUrl: input.imageUrl || null, publishedAt: input.status === "published" ? new Date() : null }).then(id => ({ id, success: true }))),
    updateArticle: adminProcedure.input(articleInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => { const { id, ...data } = input; return updateArticle(id, { ...data, imageUrl: data.imageUrl || null, publishedAt: data.status === "published" ? new Date() : null }).then(() => ({ success: true })); }),
    publishArticle: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(({ input }) => updateArticle(input.id, { status: input.status, publishedAt: input.status === "published" ? new Date() : null }).then(() => ({ success: true }))),
    deleteArticle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteArticle(input.id).then(() => ({ success: true }))),
  }),
});

export type AppRouter = typeof appRouter;
