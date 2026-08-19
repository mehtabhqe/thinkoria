import { ArrowUpRight } from "lucide-react";

export const MANUS_APP_URL = "https://commonindex-ogwzsusn.manus.space";

export function isPublicMirror() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return hostname.endsWith("vercel.app") || hostname === "thinkoria.space" || hostname === "www.thinkoria.space";
}

// Keep the legacy name for existing callers while treating the custom domain
// as the same public mirror that cannot host Manus-authenticated sessions.
export const isVercelPreview = isPublicMirror;

export function manusHref(path = "/") {
  return `${MANUS_APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function publicOrManusHref(path: string) {
  return isPublicMirror() ? manusHref(path) : path;
}

export function ManusHandoffNotice({ action, path = "/" }: { action: string; path?: string }) {
  return (
    <div className="border border-[#C8472C]/35 bg-[#EAE5DA] p-7 lg:p-10">
      <p className="eyebrow"><span className="vermilion-dot" /> Live editorial room</p>
      <h2 className="mt-5 max-w-[520px] font-serif text-4xl leading-[.95] tracking-[-.035em]">Continue on Thinkoria’s live room.</h2>
      <p className="mt-5 max-w-[560px] font-sans text-sm leading-7 text-[#171614]/65">This address is a public reading room. To {action}, use the live Thinkoria application on Manus, where your account, files, and editorial records are connected.</p>
      <a href={manusHref(path)} className="button-vermilion mt-7 inline-flex">Open the live application <ArrowUpRight size={15} /></a>
    </div>
  );
}
