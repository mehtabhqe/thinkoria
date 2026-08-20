import { describe, expect, it } from "vitest";

describe("Resend credential", () => {
  it("authenticates against the domains endpoint", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be configured for this check").toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status).toBe(200);
    const payload = await response.json() as { object?: string };
    expect(payload.object).toBe("list");
  }, 15_000);
});
