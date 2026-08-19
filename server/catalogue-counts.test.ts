import { describe, expect, it } from "vitest";
import { countPublishedByCategory, publishedCategoryCount } from "@/lib/catalogueCounts";

describe("catalogue published-paper counts", () => {
  it("counts published articles by category and returns zero for empty categories", () => {
    const counts = countPublishedByCategory([
      { category: { name: "Philosophy" } },
      { category: { name: "Philosophy" } },
      { category: { name: "History" } },
    ]);

    expect(publishedCategoryCount(counts, "Philosophy")).toBe(2);
    expect(publishedCategoryCount(counts, "History")).toBe(1);
    expect(publishedCategoryCount(counts, "Politics")).toBe(0);
  });
});
