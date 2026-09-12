import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterBar from "@/components/FooterBar";
import WritingBody from "@/components/WritingBody";
import WritingContents from "@/components/WritingContents";
import { getAboutData, getWritingBySlug, getWritingsData } from "@/lib/data";
import { formatDate, extractHeadings } from "@/lib/writing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);
  if (!writing) return { title: "Not found — Yousuf Hassan" };
  return {
    title: `${writing.title} — Yousuf Hassan`,
    description: writing.excerpt,
  };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [about, writing, list] = await Promise.all([
    getAboutData(),
    getWritingBySlug(slug),

    getWritingsData({ limit: 1 }),
  ]);

  if (!writing) notFound();

  const previous = writing.previous ?? undefined;
  const next = writing.next ?? undefined;
  const totalPublished: number = list.totalPublished;

  const headings = extractHeadings(writing.body ?? "");

  return (
    <div className="font-grotesk">
      <Navbar about={about} />

      <div className="paper">
        <div className="shell pt-8 lg:pt-[56px]">
          <div className="flex flex-col lg:flex-row lg:gap-[60px]">

            <div className="lg:w-[180px] lg:shrink-0">
              <Link
                href="/writing"
                className="tap inline-flex items-center gap-2.5 font-mono text-[10.5px] lg:text-[11px] uppercase tracking-[0.14em] text-[#55504A]"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B84F00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5" />
                  <path d="m11 18-6-6 6-6" />
                </svg>
                All writing
              </Link>

              <WritingContents headings={headings} />
            </div>

            <article className="flex-1 min-w-0 max-w-[880px] mt-6 lg:mt-0">

              {writing.coverImage && (
                <figure className="mb-7 lg:mb-[34px] -mx-5 sm:-mx-6 md:-mx-10 lg:mx-0">
                  <Image
                    src={writing.coverImage}
                    alt=""
                    width={880}
                    height={440}
                    priority
                    sizes="(min-width: 976px) 880px, 100vw"
                    className="w-full h-auto aspect-[16/9] lg:aspect-[2/1] object-cover lg:rounded"
                  />
                </figure>
              )}

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                {writing.tags?.[0] && (
                  <>
                    <span className="font-mono text-[9.5px] lg:text-[10.5px] font-bold uppercase tracking-[0.2em] paper-accent">
                      {writing.tags[0]}
                    </span>
                    <span
                      className="w-4 lg:w-5 h-px bg-[#C9C1B5]"
                      aria-hidden="true"
                    />
                  </>
                )}
                <span className="font-mono text-[10px] lg:text-[11.5px] uppercase tracking-[0.12em] text-[#6B665E]">
                  {formatDate(writing.publishedAt)}
                </span>
              </div>

              <h1 className="max-w-[800px] mt-3.5 lg:mt-5 text-[clamp(2rem,8vw,3.375rem)] font-bold leading-[1.08] tracking-[-0.035em] text-[#1E1E1E]">
                {writing.title}
              </h1>
              <p className="max-w-[720px] mt-4 lg:mt-[22px] font-reading text-[17px] lg:text-xl leading-[1.65] text-[#5E594F]">
                {writing.excerpt}
              </p>

              <span
                className="block w-full h-px mt-8 lg:mt-11 bg-[#E3DDD3]"
                aria-hidden="true"
              />

              <div className="mt-7 lg:mt-[34px]">
                <WritingBody body={writing.body ?? ""} />
              </div>

              <span
                className="block w-full h-px mt-10 lg:mt-[52px] bg-[#E3DDD3]"
                aria-hidden="true"
              />

              <div className="flex items-center gap-4 lg:gap-[18px] py-6 lg:py-7">
                {about.profileImage && (
                  <Image
                    src={about.profileImage}
                    alt={`${about.firstName} ${about.lastName}`}
                    width={52}
                    height={52}
                    className="w-11 h-11 lg:w-[52px] lg:h-[52px] shrink-0 rounded-full border border-primary object-cover object-[center_22%]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11.5px] lg:text-[12.5px] font-bold uppercase tracking-[0.14em] text-[#1E1E1E]">
                    {about.firstName} {about.lastName}
                  </p>
                  <p className="mt-1.5 text-sm lg:text-[14.5px] leading-[1.45] text-[#5E594F]">
                    {JOB_LINE}
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 pt-5 lg:pt-[26px] border-t border-[#E3DDD3]">
                {previous ? (
                  <Link
                    href={`/writing/${previous.slug}`}
                    className="work-row flex-1 min-w-0 px-[18px] lg:px-[22px] py-4 lg:py-5 rounded-md border border-[#DED7CC] bg-[#FBF9F5]"
                  >
                    <span className="block font-mono text-[9.5px] lg:text-[10px] uppercase tracking-[0.18em] text-[#8A857B]">
                      Previous
                    </span>
                    <span className="work-title block mt-2 text-[15px] lg:text-base font-semibold leading-[1.35] text-[#35322C] transition-colors">
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <span className="hidden lg:block flex-1" />
                )}

                {next ? (
                  <Link
                    href={`/writing/${next.slug}`}
                    className="work-row flex-1 min-w-0 px-[18px] lg:px-[22px] py-4 lg:py-5 rounded-md border border-[#DED7CC] bg-[#FBF9F5] lg:text-right"
                  >
                    <span className="block font-mono text-[9.5px] lg:text-[10px] uppercase tracking-[0.18em] text-[#8A857B]">
                      Next
                    </span>
                    <span className="work-title block mt-2 text-[15px] lg:text-base font-semibold leading-[1.35] text-[#35322C] transition-colors">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/writing"
                    className="work-row flex items-center justify-between gap-3 flex-1 min-w-0 px-[18px] lg:px-[22px] py-4 lg:py-5 rounded-md border border-[#DED7CC] bg-[#FBF9F5]"
                  >
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] paper-accent">
                      All {totalPublished} {totalPublished === 1 ? "post" : "posts"}
                    </span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B84F00"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          </div>
        </div>

        <div className="h-10 lg:h-[60px]" />
      </div>

      <FooterBar firstName={about.firstName} lastName={about.lastName} />
    </div>
  );
}

const JOB_LINE =
  "Competitive programmer, and a mentor at the IUBAT Programming Wing.";
