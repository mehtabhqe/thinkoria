import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// These are public OAuth client configuration values, not secrets. The Vercel
// mirror does not currently receive the Manus VITE_* environment variables, so
// keep safe production fallbacks while still allowing managed environments to
// override them.
export const MANUS_OAUTH_PORTAL_URL = "https://manus.im";
export const THINKORIA_APP_ID = "oGWzsuSnFDCQ4MuDeVBMKH";

// Start the Manus OAuth login. Call this from an event handler or effect at the
// moment you want to navigate, e.g. `onClick={() => startLogin()}`.
//
// It has SIDE EFFECTS — it mints a one-time nonce, writes the __Host- state
// cookie, and navigates immediately — so the cookie nonce always matches the
// `state` it sends. Do NOT call it during render (no `href={startLogin()}` /
// `loginUrl={...}`): each call overwrites the cookie, so a stray render-phase
// call would desync it from an in-flight login and the callback would reject it
// with "invalid oauth state". It returns void by design, so there is no URL to
// stash across renders.
export function buildOAuthLoginUrl({
  origin,
  nonce,
  oauthPortalUrl = MANUS_OAUTH_PORTAL_URL,
  appId = THINKORIA_APP_ID,
}: {
  origin: string;
  nonce: string;
  oauthPortalUrl?: string;
  appId?: string;
}) {
  const redirectUri = `${origin.replace(/\/$/, "")}/api/oauth/callback`;
  const state = encodeOAuthState({ redirectUri, nonce });
  const url = new URL(`${oauthPortalUrl.replace(/\/$/, "")}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");
  return { url: url.toString(), redirectUri, state };
}

let oauthRedirectInProgress = false;

function showOAuthRedirectOverlay() {
  if (typeof document === "undefined" || document.querySelector("[data-oauth-redirect-overlay]")) return;
  const overlay = document.createElement("div");
  overlay.dataset.oauthRedirectOverlay = "true";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.innerHTML = `
    <div class="oauth-redirect-card">
      <span class="oauth-redirect-spinner" aria-hidden="true"></span>
      <div>
        <p class="oauth-redirect-title">Opening secure sign-in</p>
        <p class="oauth-redirect-message">Taking you to Thinkoria’s authentication room…</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

export const isOAuthRedirectInProgress = () => oauthRedirectInProgress;

export const startLogin = () => {
  if (oauthRedirectInProgress) return;
  oauthRedirectInProgress = true;
  showOAuthRedirectOverlay();
  const nonce = crypto.randomUUID();
  document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;
  const { url } = buildOAuthLoginUrl({
    origin: window.location.origin,
    nonce,
    oauthPortalUrl: import.meta.env.VITE_OAUTH_PORTAL_URL || MANUS_OAUTH_PORTAL_URL,
    appId: import.meta.env.VITE_APP_ID || THINKORIA_APP_ID,
  });
  window.setTimeout(() => {
    window.location.href = url;
  }, 90);
};
