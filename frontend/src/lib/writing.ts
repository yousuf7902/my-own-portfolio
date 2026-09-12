export interface WritingLink {
  title: string;
  slug: string;
}

export interface Writing {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;

  body?: string;
  tags: string[];
  coverImage: string;
  readTime: number;
  publishedAt: string;
  draft: boolean;

  previous?: WritingLink | null;
  next?: WritingLink | null;
}

export interface WritingList {
  items: Writing[];
  total: number;

  totalPublished: number;
  page: number;
  pages: number;
  limit: number;
  tagCounts: { tag: string; count: number }[];
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(body: string) {
  const headings: { text: string; id: string; level: number }[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[*_`]/g, "").trim();
    if (text) headings.push({ text, id: headingId(text), level: match[1].length });
  }

  return headings;
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
