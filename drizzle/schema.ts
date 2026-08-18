import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core Manus OAuth user record. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  kicker: varchar("kicker", { length: 160 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  authorName: varchar("authorName", { length: 180 }).notNull(),
  categoryId: int("categoryId").notNull().references(() => categories.id),
  imageUrl: text("imageUrl"),
  manuscriptUrl: text("manuscriptUrl"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  submitterId: int("submitterId").references(() => users.id),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  abstract: text("abstract").notNull(),
  manuscriptUrl: text("manuscriptUrl"),
  status: mysqlEnum("status", ["received", "reviewing", "accepted", "declined"]).default("received").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const clubEvents = mysqlTable("clubEvents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 240 }).notNull(),
  description: text("description").notNull(),
  venue: varchar("venue", { length: 240 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  registrationOpen: int("registrationOpen").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const clubMemberships = mysqlTable("clubMemberships", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  status: mysqlEnum("status", ["active", "waitlisted", "cancelled"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const clubApplications = mysqlTable("clubApplications", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => clubEvents.id),
  userId: int("userId").notNull().references(() => users.id),
  role: mysqlEnum("role", ["debator", "mediator", "jury", "timekeeper", "organizer", "observer", "other"]).notNull(),
  otherRole: varchar("otherRole", { length: 160 }),
  note: text("note"),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "waitlisted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const forumThreads = mysqlTable("forumThreads", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull().references(() => users.id),
  title: varchar("title", { length: 240 }).notNull(),
  body: text("body").notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const forumPosts = mysqlTable("forumPosts", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull().references(() => forumThreads.id),
  authorId: int("authorId").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;
export type ClubEvent = typeof clubEvents.$inferSelect;
export type InsertClubEvent = typeof clubEvents.$inferInsert;
export type ClubMembership = typeof clubMemberships.$inferSelect;
export type InsertClubMembership = typeof clubMemberships.$inferInsert;
export type ClubApplication = typeof clubApplications.$inferSelect;
export type InsertClubApplication = typeof clubApplications.$inferInsert;
export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = typeof forumThreads.$inferInsert;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;
