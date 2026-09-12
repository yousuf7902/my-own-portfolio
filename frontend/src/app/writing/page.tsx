import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterBar from "@/components/FooterBar";
import { getAboutData, getWritingsData } from "@/lib/data";
import { formatDate, type WritingList } from "@/lib/writing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing — Yousuf Hassan",
  description:
    "Notes on algorithms, engineering and mentoring, kept so I stop solving the same problem twice.",
};

const TAGLINE = "Notes I keep so I stop solving the same problem twice.";
const INTRO =
  "Mostly algorithms and the shape of a problem before the code shows up — plus the occasional post-mortem from something I shipped. Written for the version of me who forgets.";

export default async function WritingIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[]; page?: string | string[] }>;
}) {
  const query = await searchParams;

  const activeTag =
    typeof query.tag === "string" && query.tag ? query.tag : undefined;
  const requestedPage =
    typeof query.page === "string" ? Number(query.page) : 1;

  const [about, list] = await Promise.all([
    getAboutData(),
    getWritingsData({
      page: Number.isFinite(requestedPage) ? requestedPage : 1,
      tag: activeTag,
    }),
  ]);

  const { items, total, totalPublished, page, pages, tagCounts: tags }: WritingList =
    list;

  const onFirstPage = page === 1;
  const [featured, ...rest] = onFirstPage ? items : [];
  const rows = onFirstPage ? rest : items;

  const firstRowNumber = onFirstPage ? 2 : (page - 1) * list.limit + 1;

  const href = (next: { tag?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (next.tag) params.set("tag", next.tag);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    return qs ? `/writing?${qs}` : "/writing";
  };

  const newest = items[0];
  const lastUpdated = newest
    ? new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(newest.publishedAt))
    : "";

  return (
    <div className="font-grotesk">
      <Navbar about={about} />

      <div className="paper">
        <header className="shell pt-12 lg:pt-[84px]">
          <div className="flex flex-col lg:flex-row lg:gap-[60px]">
            <div className="lg:w-[180px] lg:shrink-0">
              <p className="font-mono text-[10.5px] lg:text-[11px] font-bold tracking-[0.24em] uppercase paper-accent">
                Writing
              </p>
              <span
                className="hidden lg:block w-[22px] h-px my-4 bg-[#C9C1B5]"
                aria-hidden="true"
              />
              <p className="mt-2.5 lg:mt-0 text-sm lg:text-[14.5px] leading-[1.6] text-[#6B665E] text-balance">
                {TAGLINE}
              </p>
            </div>

            <div className="flex-1 min-w-0 mt-5 lg:mt-0">
              <h1 className="max-w-[900px] text-[clamp(2.5rem,10vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#1E1E1E]">
                Things I figure out,
                <br className="hidden sm:block" /> written{" "}
                <span className="text-primary">down</span>.
              </h1>
              <p className="max-w-[660px] mt-5 lg:mt-[26px] font-reading text-[17px] lg:text-xl leading-[1.65] text-[#5E594F]">
                {INTRO}
              </p>

              <div className="flex items-center gap-4 lg:gap-[26px] mt-5 lg:mt-[30px]">
                <span className="font-mono text-[10.5px] lg:text-[11.5px] tracking-[0.16em] uppercase text-[#6B665E]">
                  {totalPublished} {totalPublished === 1 ? "post" : "posts"}
                </span>
                {lastUpdated && (
                  <>
                    <span
                      className="w-px h-3 bg-[#D3CCC0]"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10.5px] lg:text-[11.5px] tracking-[0.16em] uppercase text-[#6B665E]">
                      Last updated {lastUpdated}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="shell pt-10 lg:pt-[72px] pb-2">
          <div className="flex flex-col lg:flex-row lg:gap-[60px]">
            <div className="hidden lg:block lg:w-[180px] lg:shrink-0" />

            <div className="flex-1 min-w-0">
              {total === 0 && !activeTag ? (
                <p className="py-10 font-reading text-lg text-[#5E594F]">
                  Nothing published yet. The first piece is on its way.
                </p>
              ) : (
                <>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-6 lg:pb-7">
                      <Link
                        href={href({})}
                        aria-current={activeTag ? undefined : "page"}
                        className={`tap flex items-center gap-2 rounded px-3.5 py-[7px] font-mono text-[10.5px] lg:text-[11px] uppercase tracking-[0.14em] transition-colors ${
                          activeTag
                            ? "border border-[#D3CCC0] text-[#55504A] hover:border-[#B84F00]"
                            : "bg-primary font-bold text-bg_primary"
                        }`}
                      >
                        All{" "}
                        <span
                          className={activeTag ? "text-[#8A857B]" : "opacity-65"}
                        >
                          {totalPublished}
                        </span>
                      </Link>
                      {tags.map(({ tag: name, count }) => {
                        const isActive = name === activeTag;
                        return (
                          <Link
                            key={name}
                            href={href({ tag: name })}
                            aria-current={isActive ? "page" : undefined}
                            className={`tap flex items-center gap-2 rounded px-3.5 py-[7px] font-mono text-[10.5px] lg:text-[11px] uppercase tracking-[0.14em] transition-colors ${
                              isActive
                                ? "bg-primary font-bold text-bg_primary"
                                : "border border-[#D3CCC0] text-[#55504A] hover:border-[#B84F00]"
                            }`}
                          >
                            {name}{" "}
                            <span
                              className={
                                isActive ? "opacity-65" : "text-[#8A857B]"
                              }
                            >
                              {count}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {items.length === 0 ? (
                    <p className="py-10 font-reading text-lg text-[#5E594F]">
                      Nothing tagged &ldquo;{activeTag}&rdquo; yet.
                    </p>
                  ) : (
                    <>

                    {featured && (
                    <Link
                      href={`/writing/${featured.slug}`}
                      className="work-row block py-7 lg:py-[34px] border-y border-[#D3CCC0]"
                    >
                      <span className="flex items-center gap-3 lg:gap-3.5">
                        <span className="font-mono text-[9.5px] lg:text-[10px] font-bold uppercase tracking-[0.2em] paper-accent">
                          Latest
                        </span>
                        <span
                          className="w-4 lg:w-5 h-px bg-[#C9C1B5]"
                          aria-hidden="true"
                        />
                        <span className="font-mono text-[10px] lg:text-[11.5px] uppercase tracking-[0.12em] text-[#6B665E]">
                          {formatDate(featured.publishedAt)}
                        </span>
                      </span>

                      <span className="block max-w-[820px] mt-3.5 lg:mt-[18px] text-[clamp(1.5rem,5.5vw,2.25rem)] font-semibold leading-[1.16] tracking-[-0.025em] text-[#1E1E1E]">
                        {featured.title}
                      </span>
                      <span className="block max-w-[700px] mt-3 font-reading text-base lg:text-[18.5px] leading-[1.6] text-[#5E594F]">
                        {featured.excerpt}
                      </span>

                      <span className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-5 lg:mt-[22px]">
                        <span className="inline-flex items-center gap-2.5 rounded bg-primary px-[18px] py-2.5 font-mono text-[11.5px] lg:text-xs font-bold uppercase tracking-[0.1em] text-bg_primary">
                          Read post
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
                        </span>
                        <span className="flex flex-wrap gap-x-5 gap-y-1">
                          {featured.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[11px] lg:text-[11.5px] text-[#6B665E]"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </Link>
                    )}

                    <ul>
                      {rows.map((writing, i) => (
                        <li key={writing._id}>
                          <Link
                            href={`/writing/${writing.slug}`}
                            className="work-row flex gap-3.5 lg:gap-7 lg:items-center py-5 lg:py-6 border-b border-[#E3DDD3]"
                          >
                            <span className="font-mono text-[11px] lg:text-[11.5px] pt-1 lg:pt-0 lg:w-[26px] shrink-0 text-[#A39D92]">
                              {String(firstRowNumber + i).padStart(2, "0")}
                            </span>

                            <span className="flex-1 min-w-0">
                              <span className="work-title block text-[17px] lg:text-xl font-semibold leading-[1.3] text-[#1E1E1E] transition-colors">
                                {writing.title}
                              </span>
                              <span className="block mt-2 font-reading text-[15px] lg:text-base leading-[1.55] text-[#5E594F]">
                                {writing.excerpt}
                              </span>
                              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 lg:mt-3">
                                {writing.tags?.map((tag) => (
                                  <span
                                    key={tag}
                                    className="font-mono text-[10.5px] lg:text-[11.5px] text-[#6B665E]"
                                  >
                                    {tag}
                                  </span>
                                ))}

                                <span
                                  className="lg:hidden w-[3px] h-[3px] rounded-full bg-[#C9C1B5]"
                                  aria-hidden="true"
                                />
                                <span className="lg:hidden font-mono text-[10.5px] text-[#6B665E]">
                                  {formatDate(writing.publishedAt)}
                                </span>
                              </span>
                            </span>

                            <span className="hidden lg:block w-[92px] shrink-0 text-right font-mono text-xs text-[#6B665E]">
                              {formatDate(writing.publishedAt)}
                            </span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#B84F00"
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
                        </li>
                      ))}
                    </ul>

                    {pages > 1 && (
                      <nav
                        aria-label="Pagination"
                        className="flex items-center justify-between gap-4 mt-6 lg:mt-[26px] pt-5 lg:pt-[22px] border-t border-[#D3CCC0]"
                      >
                        {page > 1 ? (
                          <Link
                            href={href({ tag: activeTag, page: page - 1 })}
                            rel="prev"
                            className="tap inline-flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase paper-accent"
                          >
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
                              <path d="M19 12H5" />
                              <path d="m11 18-6-6 6-6" />
                            </svg>
                            Newer
                          </Link>
                        ) : (
                          <span />
                        )}

                        <span className="font-mono text-[10.5px] lg:text-[11px] tracking-[0.16em] uppercase text-[#6B665E]">
                          Page {page} of {pages}
                        </span>

                        {page < pages ? (
                          <Link
                            href={href({ tag: activeTag, page: page + 1 })}
                            rel="next"
                            className="tap inline-flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase paper-accent"
                          >
                            Older posts
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
                        ) : (
                          <span />
                        )}
                      </nav>
                    )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <div className="h-10 lg:h-[70px]" />
      </div>

      <FooterBar firstName={about.firstName} lastName={about.lastName} />
    </div>
  );
}
