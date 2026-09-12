"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AboutData {
  firstName: string;
  lastName: string;
  resumeLink: string;
}

const JOB_TITLE = "Software Engineer";
const AVAILABILITY = "Open to work";

const NAV: { label: string; id?: string; href?: string }[] = [
  { label: "Experience", id: "timeline" },
  { label: "Work", id: "projects" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", id: "contact" },
];

function StatusPill({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`flex items-center border border-[#2E2E2E] rounded ${
        compact ? "gap-[7px] px-2.5 py-[5px]" : "gap-2 px-[13px] py-[7px]"
      }`}
    >
      <span className="w-[5px] h-[5px] lg:w-1.5 lg:h-1.5 rounded-full bg-primary shrink-0" />
      <span
        className={`font-mono tracking-[0.14em] uppercase text-[#C9C9C9] whitespace-nowrap ${
          compact ? "text-[9.5px]" : "text-[11px]"
        }`}
      >
        {AVAILABILITY}
      </span>
    </span>
  );
}

export default function Navbar({ about }: { about: AboutData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) {
      setActiveSection(null);
      return;
    }

    const sections = NAV.map((item) =>
      item.id ? document.getElementById(item.id) : null
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const goHome = () => {
    setMenuOpen(false);
    setActiveSection(null);
    if (onHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const isCurrent = (item: (typeof NAV)[number]) =>
    item.href ? pathname.startsWith(item.href) : item.id === activeSection;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg_primary/95 backdrop-blur-md border-b border-[#2E2E2E]">
        <div className="shell flex items-center justify-between h-14 lg:h-[66px] gap-4">

          <button
            onClick={goHome}
            className="tap flex flex-col md:flex-row items-start md:items-center gap-0.5 md:gap-3 min-w-0 text-left"
          >

            <span className="font-mono text-xs lg:text-[13px] font-bold tracking-[0.14em] uppercase text-primary whitespace-nowrap">
              {about.firstName} {about.lastName}
            </span>
            <span
              className="hidden md:inline font-mono text-[11px] text-[#4A4A4A]"
              aria-hidden="true"
            >
              &mdash;
            </span>

            <span className="font-mono text-[9px] md:text-[11px] tracking-[0.14em] uppercase text-[#6A6A6A] whitespace-nowrap">
              {JOB_TITLE}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-6 xl:gap-[34px] shrink-0">
            {NAV.map((item) => {
              const isActive = isCurrent(item);
              const className = `tap font-mono text-xs tracking-[0.1em] whitespace-nowrap transition-colors hover:text-[#F2F2F2] ${
                isActive ? "text-primary" : "text-[#9C9C9C]"
              }`;

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => goToSection(item.id!)}
                  aria-current={isActive ? "true" : undefined}
                  className={className}
                >
                  {item.label}
                </button>
              );
            })}

            <span className="hidden xl:flex">
              <StatusPill />
            </span>
          </div>

          <div className="flex lg:hidden items-center gap-3.5 shrink-0">

            <span className="hidden min-[360px]:flex">
              <StatusPill compact />
            </span>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex flex-col justify-center gap-[5px] w-11 h-11 items-end"
            >
              {menuOpen ? (
                <>
                  <span className="w-[19px] h-[1.5px] bg-[#F2F2F2] rotate-45 translate-y-[3.25px]" />
                  <span className="w-[19px] h-[1.5px] bg-primary -rotate-45 -translate-y-[3.25px]" />
                </>
              ) : (
                <>
                  <span className="w-[19px] h-[1.5px] bg-[#F2F2F2]" />
                  <span className="w-[19px] h-[1.5px] bg-[#F2F2F2]" />
                  <span className="w-[11px] h-[1.5px] bg-primary" />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-40 bg-bg_primary border-t border-[#2E2E2E] overflow-y-auto">
          <div className="shell flex flex-col py-4">
            {NAV.map((item) => {
              const isActive = isCurrent(item);
              const className = `flex items-center gap-3.5 py-4 border-b border-[#242424] font-mono text-[13px] tracking-[0.12em] uppercase text-left transition-colors ${
                isActive ? "text-primary" : "text-[#C9C9C9]"
              }`;

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => goToSection(item.id!)}
                  aria-current={isActive ? "true" : undefined}
                  className={className}
                >
                  {item.label}
                </button>
              );
            })}

            <a
              href={about.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2.5 h-[50px] mt-6 rounded bg-primary text-bg_primary font-mono text-[12.5px] font-bold tracking-[0.12em] uppercase"
            >
              Resume
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
                <path d="M12 3v13" />
                <path d="m7 12 5 5 5-5" />
                <path d="M4 21h16" />
              </svg>
            </a>

            <span className="flex justify-center mt-5 min-[360px]:hidden">
              <StatusPill compact />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
