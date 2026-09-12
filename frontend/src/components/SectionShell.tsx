import { ReactNode } from "react";

export default function SectionShell({
  id,
  no,
  title,
  tagline,

  lgPt = "lg:pt-[100px]",
  children,
}: {
  id: string;
  no: string;
  title: string;
  tagline: string;
  lgPt?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`shell pt-[46px] ${lgPt}`}>
      <div className="flex flex-col lg:flex-row lg:gap-[60px]">
        <div className="lg:w-[180px] lg:shrink-0">
          <h2 className="font-mono text-[10.5px] lg:text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
            {no} &mdash; {title}
          </h2>
          <span
            className="hidden lg:block w-[22px] h-px my-4 bg-[#3A3A3A]"
            aria-hidden="true"
          />
          <p className="mt-2.5 lg:mt-0 text-sm lg:text-[14.5px] leading-[1.55] lg:leading-[1.6] text-[#9C9C9C] text-balance">
            {tagline}
          </p>
        </div>

        <div className="flex-1 min-w-0 mt-[18px] lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
