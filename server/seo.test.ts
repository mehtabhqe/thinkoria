import { describe, expect, it } from "vitest";
import { absoluteUrl, cleanPath } from "./_core/vite";

describe("SEO URL helpers", () => {
  it("normalizes route paths without dropping query content", () => {
    expect(cleanPath("/article/against-liberalism/?utm_source=search&utm_medium=organic")).toBe("/article/against-liberalism");
    expect(cleanPath("/")).toBe("/");
  });

  it("absolutizes relative social and canonical assets on Thinkoria", () => {
    expect(absoluteUrl("/manus-storage/common-index-hero_03007214.png")).toBe("https://www.thinkoria.space/manus-storage/common-index-hero_03007214.png");
    expect(absoluteUrl("https://cdn.example.com/share.png")).toBe("https://cdn.example.com/share.png");
  });
});
