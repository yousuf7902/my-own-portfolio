"use client";

import { useMemo, useState } from "react";
import SectionShell from "./SectionShell";

interface CertificationData {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
  verifyLink: string;
  order: number;
}

const PREVIEW_COUNT = 5;

function OpenIcon() {
  return (
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
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function Certifications({
  certifications,
}: {
  certifications: CertificationData[];
}) {
  const [expanded, setExpanded] = useState(false);

  const ordered = useMemo(
    () => [...certifications].sort((a, b) => a.order - b.order),
    [certifications]
  );

  if (certifications.length === 0) return null;

  const visible = expanded ? ordered : ordered.slice(0, PREVIEW_COUNT);
  const hidden = ordered.length - visible.length;

  return (
    <SectionShell
      id="certifications"
      no="04"
      title="Credentials"
      tagline="Learned. Earned. Verified"
    >
      <ul>
        {visible.map((cert, i) => (
          <li
            key={cert._id}
            className={`flex items-center gap-3 lg:gap-6 py-[15px] lg:py-[17px] ${
              i === visible.length - 1 ? "" : "border-b v3-rule"
            }`}
          >
            <div className="flex-1 min-w-0 lg:flex lg:items-center lg:gap-6">

              <span className="lg:hidden block font-mono text-[10px] tracking-[0.12em] uppercase text-[#6A6A6A]">
                {cert.issuer}
                {cert.year && ` · ${cert.year}`}
              </span>
              <span className="hidden lg:block w-[150px] shrink-0 font-mono text-[11.5px] tracking-[0.1em] text-[#6A6A6A] truncate">
                {cert.issuer}
              </span>

              <span className="block mt-1.5 lg:mt-0 flex-1 min-w-0 text-[14.5px] lg:text-base leading-[1.35] lg:leading-normal text-[#D8D8D8]">
                {cert.title}
              </span>

              <span className="hidden lg:block shrink-0 font-mono text-xs text-[#5A5A5A]">
                {cert.year}
              </span>
            </div>

            {cert.verifyLink ? (
              <a
                href={cert.verifyLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${cert.title}`}
                className="v3-icon-btn"
              >
                <OpenIcon />
              </a>
            ) : (
              <span className="w-[34px] shrink-0" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>

      {(hidden > 0 || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="tap flex items-center gap-2.5 mt-5 lg:mt-[26px] pt-[18px] lg:pt-[22px] pb-2 w-full border-t v3-rule font-mono text-[11px] lg:text-xs tracking-[0.14em] uppercase text-primary hover:text-[#ff9a44] transition-colors"
        >
          {expanded ? "Show fewer" : `See all ${ordered.length} credentials`}
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
            className={expanded ? "-rotate-90" : ""}
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      )}
    </SectionShell>
  );
}
