"use client";

import { useEffect, useState } from "react";

interface Heading {
  text: string;
  id: string;
  level: number;
}

export default function WritingContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );

  useEffect(() => {
    const sections = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Contents"
      className="mt-7 lg:mt-[28px] pt-5 lg:pt-[22px] border-t border-[#E3DDD3]"
    >
      <p className="font-mono text-[10.5px] lg:text-[11px] font-bold tracking-[0.24em] uppercase paper-accent">
        Contents
      </p>

      <ul className="flex flex-col gap-0 lg:gap-2 mt-3 lg:mt-4">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block pl-3 py-[14px] lg:py-1 font-mono text-xs leading-[1.45] border-l-2 transition-colors ${
                  heading.level === 3 ? "ml-3" : ""
                } ${
                  isActive
                    ? "border-primary text-[#1E1E1E]"
                    : "border-[#E3DDD3] text-[#6B665E] hover:text-[#1E1E1E]"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
