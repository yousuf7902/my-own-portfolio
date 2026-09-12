"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FaLink,
  FaGithub,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import SectionShell from "./SectionShell";

interface ProjectData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  thumbnailIndex: number;
  liveLink: string;
  githubLink: string;
  technologies: string[];
  highlights?: string[];
  category: string;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  order: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function projectYear(project: ProjectData): string {
  const stamp = project.endDate || project.startDate;
  return stamp ? String(new Date(stamp).getFullYear()) : "";
}

function OpenIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[#6A6A6A] shrink-0">
      <span className="w-[5px] h-[5px] rounded-full bg-[#2ecc71]" />
      Live
    </span>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectData;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="modal-content p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            {project.title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="text-white hover:text-primary transition-colors text-2xl shrink-0"
          >
            <FaXmark />
          </button>
        </div>

        {project.images.length > 0 && (
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={project.images[currentIndex]}
              alt={`${project.title} — ${currentIndex + 1}`}
              width={900}
              height={500}
              className="w-full h-52 sm:h-64 md:h-80 object-cover"
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? project.images.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === project.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary transition-colors"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Image ${i + 1}`}
                      className={`carousel-dot ${i === currentIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase bg-primary/20 text-primary px-3 py-1 rounded">
            {project.category}
          </span>
          {project.startDate && (
            <span className="font-mono text-xs text-[#8E8E8E]">
              {formatDate(project.startDate)} &mdash; {formatDate(project.endDate)}
            </span>
          )}
        </div>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span key={i} className="font-mono text-[11.5px] text-[#9C9C9C]">
                {tech}
              </span>
            ))}
          </div>
        )}

        <p className="text-[#C9C9C9] text-[15px] sm:text-base leading-[1.75] mb-6">
          {project.fullDescription || project.shortDescription}
        </p>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="flex flex-col gap-2 mb-6">
            {project.highlights.map((point, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[#9C9C9C] text-[14.5px] leading-relaxed"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-bg_primary px-5 py-2.5 rounded font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#ff8a2a] transition-colors"
            >
              <FaLink size={12} /> Live demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-hairline text-[#C9C9C9] px-5 py-2.5 rounded font-mono text-[12px] tracking-[0.1em] uppercase hover:border-primary hover:text-primary transition-colors"
            >
              <FaGithub size={12} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const ordered = useMemo(() => {
    const filtered = activeCategory
      ? projects.filter((p) => p.category === activeCategory)
      : projects;
    return [...filtered].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order
    );
  }, [projects, activeCategory]);

  if (projects.length === 0) return null;

  return (
    <SectionShell
      id="projects"
      no="02"
      title="Work"
      tagline="Pick one, I’ll tell you what I was building."
    >
      {categories.length > 1 && (
        <div className="v3-tabs pb-6 lg:pb-7">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`v3-tab ${activeCategory === null ? "active" : ""}`}
          >
            All <span className="n">{projects.length}</span>
          </button>
          {categories.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveCategory(name)}
              className={`v3-tab ${activeCategory === name ? "active" : ""}`}
            >
              <span className="max-w-[9rem] truncate">{name}</span>
              <span className="n">{count}</span>
            </button>
          ))}
        </div>
      )}

      <div>
        {ordered.map((project, i) => {
          const thumbnail =
            project.images.length > 0
              ? project.images[project.thumbnailIndex] || project.images[0]
              : null;
          const year = projectYear(project);

          return (
            <button
              key={project._id}
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`${project.title} — view details`}
              className={`work-row block lg:flex lg:items-center lg:gap-7 pt-5 lg:pt-[26px] pb-[22px] lg:pb-[26px] border-t v3-rule ${
                i === ordered.length - 1 ? "border-b" : ""
              }`}
            >

              <span className="hidden lg:block w-[26px] shrink-0 font-mono text-[11.5px] text-[#4A4A4A]">
                {String(i + 1).padStart(2, "0")}
              </span>

              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt=""
                  width={208}
                  height={132}
                  className="work-thumb block w-full h-[150px] sm:h-[190px] lg:w-[104px] lg:h-[66px] shrink-0 object-cover border border-[#2E2E2E] mb-3.5 lg:mb-0"
                />
              ) : (
                <span
                  className="work-thumb hidden lg:flex items-center justify-center w-[104px] h-[66px] shrink-0 border border-[#2E2E2E] font-mono text-2xl text-[#3A3A3A]"
                  aria-hidden="true"
                >
                  {project.title.charAt(0)}
                </span>
              )}

              <span className="block flex-1 min-w-0">
                <span className="flex items-baseline justify-between gap-3 lg:justify-start">
                  <span className="work-title text-[18px] lg:text-xl font-semibold text-[#F2F2F2] transition-colors">
                    {project.title}
                  </span>
                  {project.liveLink && (
                    <span className="hidden lg:flex">
                      <LiveBadge />
                    </span>
                  )}
                  {year && (
                    <span className="lg:hidden font-mono text-[11px] text-[#5A5A5A] shrink-0">
                      {year}
                    </span>
                  )}
                </span>

                {project.liveLink && (
                  <span className="flex lg:hidden mt-1.5">
                    <LiveBadge />
                  </span>
                )}

                <span className="block mt-[7px] text-sm lg:text-[14.5px] leading-[1.6] text-[#8E8E8E]">
                  {project.shortDescription}
                </span>

                {project.technologies.length > 0 && (
                  <span className="flex flex-wrap gap-x-4 gap-y-1.5 lg:gap-x-5 mt-2.5 lg:mt-[11px]">
                    {project.technologies.slice(0, 5).map((tech, t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] lg:text-[11.5px] text-[#6A6A6A]"
                      >
                        {tech}
                      </span>
                    ))}
                  </span>
                )}
              </span>

              {year && (
                <span className="hidden lg:block shrink-0 font-mono text-xs text-[#5A5A5A]">
                  {year}
                </span>
              )}
              <span
                className="hidden lg:block shrink-0 text-primary"
                aria-hidden="true"
              >
                <OpenIcon />
              </span>
            </button>
          );
        })}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </SectionShell>
  );
}
