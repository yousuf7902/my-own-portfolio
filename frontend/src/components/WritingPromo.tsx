import Link from "next/link";
import SectionShell from "./SectionShell";
import { Writing, formatDate } from "@/lib/writing";

const TAGLINE = "Notes I keep so I stop solving the same problem twice.";
const HEADLINE_LEAD = "Things I figure out,";
const HEADLINE_ACCENT = "down";

export const PROMO_LIMIT = 3;

export default function WritingPromo({
  writings,
  total,
}: {
  writings: Writing[];

  total: number;
}) {
  const recent = writings.slice(0, PROMO_LIMIT);

  const hasWritings = recent.length > 0;

  return (
    <SectionShell id="writing" no="05" title="Writing" tagline={TAGLINE}>
      <div
        className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-[60px] ${
          hasWritings ? "pb-6 lg:pb-[30px]" : ""
        }`}
      >
        <h3 className="max-w-[600px] text-[clamp(1.75rem,7vw,2rem)] lg:text-[38px] font-semibold leading-[1.15] tracking-[-0.025em] text-[#F2F2F2]">
          {HEADLINE_LEAD}
          <br className="hidden lg:block" /> written{" "}
          <span className="text-primary">{HEADLINE_ACCENT}</span>.
        </h3>

        <Link
          href="/writing"
          className="tap inline-flex shrink-0 items-center justify-center gap-2.5 self-start rounded bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg_primary"
        >
          Read the writing
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>

      {hasWritings && (
        <>
        <ul>
          {recent.map((writing, i) => (
            <li key={writing._id}>
              <Link
                href={`/writing/${writing.slug}`}
                className="work-row flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-7 py-4 lg:py-5 border-t v3-rule"
              >
                <span className="font-mono text-[11px] lg:text-xs lg:w-[92px] lg:shrink-0 text-[#5A5A5A]">
                  {formatDate(writing.publishedAt)}
                </span>
                <span className="work-title flex-1 min-w-0 text-base lg:text-[17px] font-medium text-[#D8D8D8] transition-colors">
                  {writing.title}
                </span>
                <span className="font-mono text-[11px] lg:text-[11.5px] lg:w-[110px] lg:shrink-0 lg:text-right text-[#6A6A6A]">
                  {writing.tags?.[0] ?? ""}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FD6F00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden lg:block shrink-0"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </Link>
              {i === recent.length - 1 && (
                <span className="block border-b v3-rule" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/writing"
          className="tap inline-flex items-center gap-3 mt-[22px] font-mono text-xs tracking-[0.14em] uppercase text-primary"
        >
          All {total} {total === 1 ? "post" : "posts"}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
        </>
      )}
    </SectionShell>
  );
}
