import { describe, expect, it } from "vitest";
import { clubMembershipEmail, debateApplicationEmail, emailLayout, newsletterEmail, submissionDecisionEmail, submissionReceivedEmail, welcomeEmail } from "./email";

describe("Thinkoria transactional email templates", () => {
  it("keeps event keys deterministic for duplicate protection", () => {
    expect(newsletterEmail("reader@thinkoria.space", "newsletter:12").eventKey).toBe("newsletter:12");
    expect(clubMembershipEmail("Reader", "reader@thinkoria.space", "club_membership:7").kind).toBe("club_membership");
  });

  it("escapes user-provided names in HTML", () => {
    const message = welcomeEmail("<Reader>", "reader@thinkoria.space", "welcome:user-1");
    expect(message.html).toContain("&lt;Reader&gt;");
    expect(message.html).not.toContain("<Reader>");
    expect(message.subject).toBe("Your Thinkoria account is verified");
  });

  it("renders the verified Thinkoria sender identity in the layout copy", () => {
    const html = emailLayout("Preview", "A subject", "<p>Body</p>");
    expect(html).toContain("Thinkoria");
    expect(html).toContain("A place of ideas");
    const application = debateApplicationEmail("Reader", "reader@thinkoria.space", "mediator", "debate_application:2");
    expect(application.subject).toContain("application");
    expect(application.text).toContain("does not confirm acceptance");
    expect(application.html).toContain("does not confirm acceptance of the role");
    const newsletter = newsletterEmail("reader@thinkoria.space", "newsletter:12");
    expect(newsletter.text).toContain("Your Thinkoria subscription is confirmed");
    expect(newsletter.text).toContain("Unsubscribe");
    expect(newsletter.html).toContain("Unsubscribe");
    expect(clubMembershipEmail("Reader", "reader@thinkoria.space", "club_membership:7").text).toContain("membership");
    const submission = submissionReceivedEmail("Reader", "reader@thinkoria.space", "A careful question", "Philosophy", "submission_received:9");
    expect(submission.kind).toBe("submission_received");
    expect(submission.text).toContain("2–3 days");
    expect(submission.text).toContain("does not guarantee publication");
    expect(submission.html).toContain("Thank you for choosing Thinkoria");
    const accepted = submissionDecisionEmail("Reader", "reader@thinkoria.space", "A Careful Question", "accepted", "submission_decision:9:accepted");
    expect(accepted.kind).toBe("submission_accepted");
    expect(accepted.subject).toContain("accepted");
    expect(accepted.text).toContain("for publication");
    const declined = submissionDecisionEmail("<Reader>", "reader@thinkoria.space", "A Difficult Question", "declined", "submission_decision:10:declined");
    expect(declined.kind).toBe("submission_declined");
    expect(declined.text).toContain("not be taking this submission forward");
    expect(declined.html).toContain("&lt;Reader&gt;");
  });
});
