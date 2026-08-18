import { describe, expect, it } from "vitest";
import { doiHref, formatCitations, isDoiOrUrlToken } from "../client/src/lib/citations";

describe("citation helpers", () => {
  it("formats references with numbered APA entries", () => {
    expect(formatCitations("Author, A. (2024). A paper.\nPublisher.", "apa")).toBe("1. Author, A. (2024). A paper.\n2. Publisher.");
  });

  it("recognizes DOI values and resolves them to doi.org", () => {
    expect(isDoiOrUrlToken("10.1234/example.paper")).toBe(true);
    expect(doiHref("10.1234/example.paper")).toBe("https://doi.org/10.1234/example.paper");
    expect(isDoiOrUrlToken("https://doi.org/10.1234/example.paper")).toBe(true);
  });
});
