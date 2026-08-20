import ThinkoriaFooter from "@/components/ThinkoriaFooter";
import { trpc } from "@/lib/trpc";
import ThemeToggle from "@/components/ThemeToggle";
import { doiHref, isDoiOrUrlToken } from "@/lib/citations";
import { ArrowLeft, ArrowUpRight, Check, Copy, Eye, Facebook, Linkedin, Loader2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Streamdown } from "streamdown";

export default function Article() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug ?? "";
  const articleQuery = trpc.catalogue.article.useQuery({ slug }, { enabled: Boolean(slug) });
  const registerView = trpc.catalogue.registerView.useMutation();
  const article = articleQuery.data;
  const [copied, setCopied] = useState(false);
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const readingMinutes = article ? Math.max(1, Math.ceil(article.body.trim().split(/\s+/).filter(Boolean).length / 200)) : 1;
  const shareText = article ? `${article.title} — Thinkoria` : "Thinkoria article";
  const copyArticleLink = async () => {
    if (!articleUrl || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    if (article) registerView.mutate({ id: article.id });
  }, [article?.id]);

  if (articleQuery.isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#F3F0E8]"><Loader2 className="animate-spin text-[#C8472C]"/></div>;
  if (!article) return <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-6 text-center"><div><p className="eyebrow justify-center"><span className="vermilion-dot"/> Paper not found</p><h1 className="mt-5 font-serif text-5xl">This page has not entered the index.</h1><Link href="/catalogue" className="button-ink mt-8 inline-flex">Return to catalogue <ArrowLeft size={14}/></Link></div><ThinkoriaFooter /></main>;

  return <main className="min-h-screen bg-[#F3F0E8] text-[#171614]"><header className="border-b border-[#171614]/15"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12"><Link href="/" className="flex items-center gap-3"><img src="/manus-storage/thinkoria-logo_8998c7d8.png" alt="Thinkoria" className="h-12 w-28 object-contain object-left"/></Link><div className="flex items-center gap-5"><ThemeToggle /><Link href="/catalogue" className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[.13em] text-[#171614]/55 hover:text-[#C8472C]"><ArrowLeft size={14}/> Catalogue</Link></div></div></header><article className="mx-auto max-w-[1100px] px-6 py-16 lg:px-12 lg:py-24"><div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="eyebrow"><span className="vermilion-dot"/> {article.category.name} / CI–{String(article.id).padStart(3, "0")}</p><h1 className="mt-7 font-serif text-6xl leading-[.88] tracking-[-.055em] lg:text-[7.5rem]">{article.title}</h1></div><div className="border-l border-[#171614]/20 pl-6"><p className="font-sans text-lg leading-8 text-[#171614]/70">{article.excerpt}</p><div className="mt-7 flex flex-wrap items-center gap-4 font-sans text-[10px] uppercase tracking-[.13em] text-[#171614]/50"><span>{article.authorName}</span><span className="text-[#C8472C]">/</span><span>{new Date(article.publishedAt ?? article.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span><span className="inline-flex items-center gap-1.5"><Eye size={13}/> {(article.viewCount + 1).toLocaleString()}</span>{article.manuscriptUrl && <a href={article.manuscriptUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#C8472C] underline decoration-[#C8472C] underline-offset-4">Read published PDF</a>}</div><div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#171614]/15 pt-5 font-sans text-[10px] uppercase tracking-[.12em] text-[#171614]/50"><span className="inline-flex items-center gap-2"><span className="live-pulse"/> {readingMinutes} min read</span><span className="text-[#C8472C]">/</span><span className="inline-flex items-center gap-2"><Share2 size={13}/> Share</span><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" className="inline-flex items-center gap-1.5 text-[#171614]/60 transition-colors hover:text-[#C8472C]"><Facebook size={13}/> Facebook</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="inline-flex items-center gap-1.5 text-[#171614]/60 transition-colors hover:text-[#C8472C]"><Linkedin size={13}/> LinkedIn</a><a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" aria-label="Share on X" className="inline-flex items-center gap-1.5 text-[#171614]/60 transition-colors hover:text-[#C8472C]">X</a><button type="button" onClick={copyArticleLink} className="inline-flex items-center gap-1.5 text-[#171614]/60 transition-colors hover:text-[#C8472C]" aria-label="Copy article link">{copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? "Copied" : "Copy link"}</button></div></div></div>{article.imageUrl && <div className="mt-14 overflow-hidden border border-[#171614]/20 bg-[#D8D0C0]"><img src={article.imageUrl} alt={article.imageAlt || `${article.title} — ${article.category.name}`} className="max-h-[620px] w-full object-cover" onError={(event) => { const fallback = article.category.imageUrl; if (fallback && event.currentTarget.src !== new URL(fallback, window.location.href).href) event.currentTarget.src = fallback; else event.currentTarget.parentElement?.remove(); }}/></div>}<div className="article-body mx-auto mt-14 max-w-[720px] text-[#171614]/85"><Streamdown>{article.body}</Streamdown></div>{article.citations && <section className="mx-auto mt-16 max-w-[720px] border-t border-[#171614]/20 pt-7"><p className="eyebrow"><span className="vermilion-dot"/> References</p><div className="mt-4 space-y-2 font-sans text-sm leading-7 text-[#171614]/65">{article.citations.split(/\n+/).filter(Boolean).map((line, index) => <p key={`${article.id}-citation-${index}`}>{line.split(/(https?:\/\/doi\.org\/\S+|10\.\d{4,9}\/\S+)/gi).map((token, tokenIndex) => isDoiOrUrlToken(token) ? <a key={`${index}-${tokenIndex}`} href={doiHref(token)} target="_blank" rel="noreferrer" className="text-[#C8472C] underline decoration-[#C8472C] underline-offset-4">{token}</a> : token)}</p>)}</div></section>}<div className="mx-auto mt-16 flex max-w-[720px] items-center justify-between border-t border-[#171614]/20 pt-6"><Link href={`/catalogue`} className="button-ink">Read another paper <ArrowUpRight size={14}/></Link><a href="/submit" className="font-sans text-[10px] font-semibold uppercase tracking-[.13em] underline decoration-[#C8472C] underline-offset-4">Submit your work</a></div></article><ThinkoriaFooter /></main>;
}
