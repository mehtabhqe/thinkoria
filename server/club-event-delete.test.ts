import { describe, expect, it, vi } from "vitest";
import { clubApplications, clubEvents } from "../drizzle/schema";

const deletedTables: unknown[] = [];

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: () => ({
    delete: (table: unknown) => ({
      where: async () => {
        deletedTables.push(table);
      },
    }),
  }),
}));

describe("Club event deletion", () => {
  it("cleans dependent applications before deleting the event", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const { deleteClubEvent } = await import("./db");

    deletedTables.length = 0;
    await deleteClubEvent(42);

    expect(deletedTables).toEqual([clubApplications, clubEvents]);
  });
});
