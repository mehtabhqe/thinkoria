import { ENV } from "./_core/env";
import { hasEmailDelivery, recordEmailDelivery } from "./db";

const RESEND_API = "https://api.resend.com/emails";
const FROM = "Thinkoria <hello@thinkoria.space>";
const SITE_URL = "https://www.thinkoria.space";
const SUPPORT_EMAIL = "hello@thinkoria.space";
const UNSUBSCRIBE_URL = `mailto:${SUPPORT_EMAIL}?subject=Unsubscribe%20from%20Thinkoria%20updates`;

type EmailInput = { to: string; subject: string; html: string; text: string; eventKey: string; kind: string };

type EmailCta = { label: string; url: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] ?? char));
}

function ctaMarkup(cta: EmailCta) {
  return `<p style="margin:28px 0 8px"><a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#c8472c;color:#fff;text-decoration:none;padding:13px 20px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700">${escapeHtml(cta.label)} &nbsp;→</a></p><p style="font-size:12px;line-height:1.6;color:#777;word-break:break-word">If the button does not work, visit: ${escapeHtml(cta.url)}</p>`;
}

export function emailLayout(preheader: string, heading: string, body: string, cta?: EmailCta, options: { newsletter?: boolean } = {}) {
  const footer = options.newsletter
    ? `<p style="font-size:12px;line-height:1.7;color:#777">You are receiving this message because you subscribed to Thinkoria updates. <a href="${UNSUBSCRIBE_URL}" style="color:#777">Unsubscribe</a> or <a href="${SITE_URL}/about" style="color:#777">learn more about Thinkoria</a>.</p>`
    : `<p style="font-size:12px;line-height:1.7;color:#777">You are receiving this message because of activity on thinkoria.space. Reply to ${SUPPORT_EMAIL} if you need help.</p>`;
  return `<!doctype html><html lang="en"><head><meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no"></head><body style="margin:0;padding:0;background:#f3f0e8;color:#171614;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f0e8"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#f3f0e8"><tr><td style="padding:28px 28px 8px;border-bottom:1px solid #d8d0c0"><a href="${SITE_URL}" style="color:#171614;text-decoration:none;font-family:Georgia,serif;font-size:24px;font-weight:700">Thinkoria</a><p style="margin:8px 0 0;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#c8472c">A place of ideas</p></td></tr><tr><td style="padding:34px 28px 14px"><h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.05;font-weight:400;color:#171614">${escapeHtml(heading)}</h1><p style="margin:0;font-size:14px;line-height:1.7;color:#4f4b43">${escapeHtml(preheader)}</p></td></tr><tr><td style="padding:0 28px 34px;font-size:16px;line-height:1.75;color:#292720">${body}${cta ? ctaMarkup(cta) : ""}</td></tr><tr><td style="padding:24px 28px 28px;border-top:1px solid #d8d0c0">${footer}<p style="margin:14px 0 0;font-size:11px;line-height:1.6;color:#999">© Thinkoria · A place of ideas</p></td></tr></table></td></tr></table></body></html>`;
}

export async function sendTransactionalEmail(input: EmailInput) {
  if (!ENV.resendApiKey) return { sent: false as const, reason: "missing_key" as const };
  const response = await fetch(RESEND_API, { method: "POST", headers: { Authorization: `Bearer ${ENV.resendApiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: FROM, to: [input.to], subject: input.subject, html: input.html, text: input.text }) });
  const payload = await response.json().catch(() => ({})) as { id?: string; message?: string };
  if (!response.ok) throw new Error(payload.message || `Resend request failed with ${response.status}`);
  return { sent: true as const, id: payload.id ?? null };
}

export function welcomeEmail(name: string, email: string, eventKey: string) {
  const safeName = name || "reader";
  const cta = { label: "Explore the Catalogue", url: `${SITE_URL}/catalogue` };
  return { to: email, eventKey, kind: "welcome", subject: "Your Thinkoria account is verified", text: `Welcome to Thinkoria, ${name || "reader"}. Your account has been successfully verified, and you are now part of the Thinkoria family. Explore the Catalogue: ${cta.url}`, html: emailLayout("Your Thinkoria account has been successfully verified.", `Welcome to the family, ${safeName}.`, `<p>Welcome to Thinkoria. Your account has been successfully verified, and you are now part of our community of readers, writers, and curious minds.</p><p>Read closely, think outward, and join the conversations that keep worthwhile ideas in circulation.</p>`, cta) };
}

export function clubMembershipEmail(name: string, email: string, eventKey: string, event?: { title?: string; date?: string; venue?: string }) {
  const eventDetails = event?.title ? `<p style="padding:16px;background:#ebe5d8;border-left:3px solid #c8472c"><strong>Next gathering</strong><br>${escapeHtml(event.title)}${event.date ? `<br>${escapeHtml(event.date)}` : ""}${event.venue ? `<br>${escapeHtml(event.venue)}` : ""}</p>` : "";
  const cta = { label: "View Club Gatherings", url: `${SITE_URL}/club` };
  return { to: email, eventKey, kind: "club_membership", subject: "Welcome to the Nagaon Debate & Discussion Club", text: `Welcome, ${name || "member"}. Your membership in the Nagaon Debate & Discussion Club is now confirmed. We will keep you informed about upcoming topics, venues, dates, and reading-list updates. View Club Gatherings: ${cta.url}`, html: emailLayout("Your Nagaon Debate & Discussion Club membership is confirmed.", "Your seat is in the room.", `<p>Welcome, ${escapeHtml(name || "member")}. Your membership in the Nagaon Debate &amp; Discussion Club is now confirmed.</p><p>We will keep you informed about upcoming topics, venues, dates, and reading-list updates. We look forward to thinking together.</p>${eventDetails}`, cta) };
}

export function newsletterEmail(email: string, eventKey: string) {
  const cta = { label: "Read Thinkoria", url: SITE_URL };
  return { to: email, eventKey, kind: "newsletter", subject: "Your Thinkoria subscription is confirmed", text: `Your Thinkoria subscription is confirmed. We will send occasional updates about newly published work, conversations, and gatherings. Read Thinkoria: ${cta.url}\n\nUnsubscribe: ${UNSUBSCRIBE_URL}`, html: emailLayout("Your Thinkoria newsletter subscription is confirmed.", "Stay in circulation.", `<p>Your subscription to Thinkoria’s regular updates is confirmed.</p><p>We will send occasional notes about newly published papers, conversations, and gatherings—only what is worth keeping in circulation.</p><p style="font-size:14px;color:#4f4b43">Thinkoria sends updates occasionally, not daily. You can unsubscribe at any time using the link below.</p>`, cta, { newsletter: true }) };
}

export async function sendWelcomeEmailOnce(name: string, email: string, eventKey: string) {
  const input = welcomeEmail(name, email, eventKey);
  try {
    if (await hasEmailDelivery(eventKey)) return;
    const result = await sendTransactionalEmail(input);
    await recordEmailDelivery({ eventKey, kind: input.kind, recipient: input.to, status: result.sent ? "sent" : "failed", providerId: result.sent ? result.id : null });
  } catch (error) {
    console.warn("[Thinkoria] Welcome email skipped:", error);
    await recordEmailDelivery({ eventKey, kind: input.kind, recipient: input.to, status: "failed" });
  }
}

export function debateApplicationEmail(name: string, email: string, role: string, eventKey: string) {
  const cta = { label: "Visit the Club", url: `${SITE_URL}/club` };
  return { to: email, eventKey, kind: "debate_application", subject: "We received your Nagaon Club role application", text: `Thank you, ${name || "member"}. We received your application for the ${role} role. Our team will review your application and let you know when a decision or next step is available. This email confirms receipt only; it does not confirm acceptance. Visit the Club: ${cta.url}`, html: emailLayout("Your Nagaon Club role application has been received for review.", "Thank you for connecting with us.", `<p>Thank you, ${escapeHtml(name || "member")}. We have received your application for the <strong>${escapeHtml(role)}</strong> role.</p><p>Our team will review your application and let you know when a decision or next step is available. This email confirms receipt of your application only; it does not confirm acceptance of the role.</p><p>Until then, stay in touch and keep thinking with us.</p>`, cta) };
}
