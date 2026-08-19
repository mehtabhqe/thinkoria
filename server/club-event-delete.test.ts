import { describe, expect, it, vi } from "vitest";
import { clubApplications, clubEvents } from "../drizzle/schema";

const operations: Array<{ action: string; table: unknown }> = [];

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: () => ({
    update: (table: unknown) => ({
      set: () => ({
        where: async () => {
          operations.push({ action: "update", table });
        },
      }),
    }),
    delete: (table: unknown) => ({
      where: async () => {
        operations.push({ action: "delete", table });
      },
    }),
  }),
}));

describe("Club event deletion", () => {
  it("unlinks dependent applications before deleting the event", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const { deleteClubEvent } = await import("./db");

    operations.length = 0;
    await deleteClubEvent(42);

    expect(operations).toEqual([
      { action: "update", table: clubApplications },
      { action: "delete", table: clubEvents },
    ]);
  });
});
