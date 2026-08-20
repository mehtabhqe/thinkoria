import { describe, expect, it } from "vitest";
import { normalizeNewsletterEmail } from "./db";

describe("newsletter subscription contracts", () => {
  it("normalizes email addresses before persistence", () => {
    expect(normalizeNewsletterEmail("  Reader@Thinkoria.Space ")).toBe("reader@thinkoria.space");
  });

  it("keeps already-normalized addresses stable", () => {
    expect(normalizeNewsletterEmail("reader@thinkoria.space")).toBe("reader@thinkoria.space");
  });
});
