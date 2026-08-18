export type CitationStyle = "apa" | "mla" | "chicago";

export function formatCitations(raw: string, style: CitationStyle) {
  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const number = `${index + 1}.`;
      if (/^\d+\.\s/.test(line)) return line;
      if (style === "apa") return `${number} ${line}`;
      if (style === "mla") return `${number} ${line.replace(/\.\s*$/, "")}.`;
      return `${number} ${line.replace(/\.\s*$/, "")}.`;
    })
    .join("\n");
}

export function isDoiOrUrlToken(token: string) {
  return /^https?:\/\/doi\.org\/\S+$/i.test(token) || /^10\.\d{4,9}\/\S+$/i.test(token);
}

export function doiHref(token: string) {
  return token.startsWith("http") ? token : `https://doi.org/${token}`;
}
