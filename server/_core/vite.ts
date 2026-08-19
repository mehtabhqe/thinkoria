import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { getArticleBySlug, listPublishedArticles } from "../db";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const SITE_NAME = "Thinkoria";
const CANONICAL_ORIGIN = (process.env.CANONICAL_ORIGIN || "https://www.thinkoria.space").replace(/\/$/, "");
const DEFAULT_DESCRIPTION = "Thinkoria is a publishing room for papers, essays, and working thoughts that move between disciplines.";
const DEFAULT_IMAGE = "/manus-storage/common-index-hero_03007214.png";

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '\"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export function absoluteUrl(value: string) {
  return value.startsWith("http") ? value : `${CANONICAL_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

export function cleanPath(url: string) {
  const raw = url.split("?")[0] || "/";
  try {
    return decodeURI(raw).replace(/\/+$/, "") || "/";
  } catch {
    return raw.replace(/\/+$/, "") || "/";
  }
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function buildSeoHead(url: string) {
  const pathname = cleanPath(url);
  let title = "Thinkoria — A place of ideas";
  let description = DEFAULT_DESCRIPTION;
  let image = DEFAULT_IMAGE;
  let type: "website" | "article" = "website";
  let noindex = false;
  let notFound = false;
  let publishedTime: string | undefined;
  let modifiedTime: string | undefined;
  let structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${CANONICAL_ORIGIN}/`,
    description: DEFAULT_DESCRIPTION,
  };

  if (pathname === "/") {
    title = "Thinkoria — A place of ideas";
  } else if (pathname === "/catalogue") {
    title = "Catalogue of Papers and Essays — Thinkoria";
    description = "Explore Thinkoria’s interdisciplinary catalogue of published papers, essays, and working thoughts.";
  } else if (pathname === "/about") {
    title = "About Thinkoria — A place of ideas";
    description = "Learn about Thinkoria’s vision for careful reading, generous disagreement, and interdisciplinary publishing.";
  } else if (pathname === "/club") {
    title = "Nagaon Debate & Discussion Club — Thinkoria";
    description = "Join Thinkoria’s Nagaon Debate & Discussion Club for public conversation, weekly debates, and thoughtful disagreement.";
  } else if (pathname === "/forum") {
    title = "Thinkoria Forum — Think out loud";
    description = "Discuss ideas, questions, papers, and public thinking with the Thinkoria community.";
  } else if (pathname === "/admin" || pathname === "/auth/login" || pathname === "/submit") {
    noindex = true;
  } else {
    const articleMatch = pathname.match(/^\/article\/([^/]+)$/);
    if (articleMatch) {
      const article = await getArticleBySlug(articleMatch[1]);
      if (article && article.status === "published") {
        title = `${article.title} — Thinkoria`;
        description = article.excerpt || `${article.title} by ${article.authorName}, published in Thinkoria’s ${article.category.name} catalogue.`;
        image = article.imageUrl || DEFAULT_IMAGE;
        type = "article";
        publishedTime = article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined;
        modifiedTime = article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined;
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description,
          image: [absoluteUrl(image)],
          author: { "@type": "Person", name: article.authorName },
          publisher: { "@type": "Organization", name: SITE_NAME, url: `${CANONICAL_ORIGIN}/` },
          articleSection: article.category.name,
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          mainEntityOfPage: `${CANONICAL_ORIGIN}${pathname}`,
        };
      } else {
        title = "Paper not found — Thinkoria";
        description = "The requested Thinkoria paper could not be found.";
        noindex = true;
        notFound = true;
      }
    } else {
      title = "Page not found — Thinkoria";
      description = "The requested Thinkoria page could not be found.";
      noindex = true;
      notFound = true;
    }
  }

  const canonical = `${CANONICAL_ORIGIN}${pathname === "/" ? "/" : pathname}`;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(absoluteUrl(image))}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(absoluteUrl(image))}" />`,
    noindex ? `<meta name="robots" content="noindex,follow" />` : `<meta name="robots" content="index,follow,max-image-preview:large" />`,
    publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : "",
    modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : "",
    `<script type="application/ld+json">${jsonLd(structuredData)}</script>`,
  ].filter(Boolean).join("\n    ");
  return { tags, noindex, notFound, title };
}

async function buildSitemap() {
  const articles = await listPublishedArticles();
  const urls = ["/", "/catalogue", "/about", "/club", "/forum", ...articles.map(article => `/article/${encodeURIComponent(article.slug)}`)];
  const entries = urls.map(url => `  <url><loc>${escapeHtml(`${CANONICAL_ORIGIN}${url}`)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

function registerSeoEndpoints(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth/\nDisallow: /submit\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      res.type("application/xml").send(await buildSitemap());
    } catch {
      res.status(503).type("application/xml").send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>");
    }
  });
}

async function composeTemplate(template: string, url: string) {
  const seo = await buildSeoHead(url);
  return {
    html: template.replace("<!--app-head-->", seo.tags).replace("<!--app-html-->", ""),
    notFound: seo.notFound,
  };
}

export async function setupVite(app: Express, server: Server) {
  registerSeoEndpoints(app);
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const composed = await composeTemplate(template, url);
      const page = await vite.transformIndexHtml(url, composed.html);
      res.status(composed.notFound ? 404 : 200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  registerSeoEndpoints(app);
  const distPath = process.env.NODE_ENV === "development" ? path.resolve(import.meta.dirname, "../..", "dist", "public") : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  app.use(express.static(distPath, { index: false }));
  app.use("*", async (req, res) => {
    try {
      const template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      const composed = await composeTemplate(template, req.originalUrl);
      res.status(composed.notFound ? 404 : 200).type("html").send(composed.html);
    } catch {
      res.status(500).send("Unable to render Thinkoria");
    }
  });
}
