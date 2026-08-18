import { and, asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  articles,
  categories,
  clubApplications,
  clubEvents,
  clubMemberships,
  forumPosts,
  forumThreads,
  InsertArticle,
  InsertCategory,
  InsertClubApplication,
  InsertUser,
  submissions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function listPublishedArticles(categorySlug?: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ article: articles, category: categories }).from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .where(categorySlug ? and(eq(articles.status, "published"), eq(categories.slug, categorySlug)) : eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt));
  return rows.map(({ article, category }) => ({ ...article, category }));
}

export async function listAdminArticles() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ article: articles, category: categories }).from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .orderBy(desc(articles.updatedAt));
  return rows.map(({ article, category }) => ({ ...article, category }));
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({ article: articles, category: categories }).from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(articles.slug, slug)).limit(1);
  return result[0] ? { ...result[0].article, category: result[0].category } : undefined;
}

export async function incrementArticleView(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(articles).set({ viewCount: sql`${articles.viewCount} + 1` }).where(eq(articles.id, id));
}

export async function createArticle(input: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(articles).values(input);
  return result[0].insertId;
}

export async function updateArticle(id: number, input: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(articles).set(input).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(articles).where(eq(articles.id, id));
}

export async function createCategory(input: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(categories).values(input);
  return result[0].insertId;
}

export async function createSubmission(input: typeof submissions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(submissions).values(input);
  return result[0].insertId;
}

export async function listAdminSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt));
}

export async function updateSubmissionStatus(id: number, status: "received" | "reviewing" | "accepted" | "declined") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(submissions).set({ status }).where(eq(submissions.id, id));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result[0];
}

export async function joinClub(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(clubMemberships).where(eq(clubMemberships.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  const result = await db.insert(clubMemberships).values({ userId, status: "active" });
  return { id: result[0].insertId, userId, status: "active" as const };
}

export async function listForumThreads() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ thread: forumThreads, author: users }).from(forumThreads)
    .innerJoin(users, eq(forumThreads.authorId, users.id)).orderBy(desc(forumThreads.updatedAt));
}

export async function listClubEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clubEvents).orderBy(asc(clubEvents.eventDate));
}

export async function createClubEvent(input: typeof clubEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(clubEvents).values(input);
  return result[0].insertId;
}

export async function updateClubEvent(id: number, input: Partial<typeof clubEvents.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(clubEvents).set(input).where(eq(clubEvents.id, id));
}

export async function deleteClubEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(clubEvents).where(eq(clubEvents.id, id));
}

export async function listClubMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ membership: clubMemberships, user: users }).from(clubMemberships)
    .innerJoin(users, eq(clubMemberships.userId, users.id)).orderBy(desc(clubMemberships.createdAt));
}

export async function listClubApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ application: clubApplications, user: users, event: clubEvents }).from(clubApplications)
    .innerJoin(users, eq(clubApplications.userId, users.id))
    .innerJoin(clubEvents, eq(clubApplications.eventId, clubEvents.id))
    .orderBy(desc(clubApplications.createdAt));
}

export async function createClubApplication(input: InsertClubApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(clubApplications).where(and(eq(clubApplications.eventId, input.eventId), eq(clubApplications.userId, input.userId))).limit(1);
  if (existing[0]) throw new Error("You already applied for this debate");
  const result = await db.insert(clubApplications).values(input);
  return result[0].insertId;
}

export async function updateClubApplicationStatus(id: number, status: "pending" | "accepted" | "declined" | "waitlisted") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(clubApplications).set({ status }).where(eq(clubApplications.id, id));
}

export async function createForumThread(input: { authorId: number; title: string; body: string; category: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(forumThreads).values(input);
  return result[0].insertId;
}

export async function listForumPosts(threadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ post: forumPosts, author: users }).from(forumPosts)
    .innerJoin(users, eq(forumPosts.authorId, users.id))
    .where(eq(forumPosts.threadId, threadId))
    .orderBy(asc(forumPosts.createdAt));
}

export async function createForumPost(input: { threadId: number; authorId: number; body: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(forumPosts).values(input);
  return result[0].insertId;
}
