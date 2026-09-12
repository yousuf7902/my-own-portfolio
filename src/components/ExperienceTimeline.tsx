"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaBriefcase,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaCode,
} from "react-icons/fa6";
import { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  FaBriefcase,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaCode,
};

const TYPE_COLORS: Record<string, string> = {
  work: "border-primary",
  education: "border-white",
  volunteer: "border-orange-400",
};

interface ExperienceData {
  _id: string;
  title: string;
  organization: string;
  type: "work" | "education" | "volunteer";
  startDate: string;
  endDate: string | null;
  description: string;
  icon: string;
  order: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TimelineEntry({
  experience,
  index,
}: {
  experience: ExperienceData;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const entryRef = useRef<HTMLDivElement>(null);
  const IconComponent = ICON_MAP[experience.icon] || FaBriefcase;
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (entryRef.current) {
      observer.observe(entryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={entryRef}
      className={`relative flex items-start mb-12 md:mb-16 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-all duration-700`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {/* Desktop: alternating layout */}
      <div className="hidden md:flex w-full items-start">
        {/* Left content */}
        <div className={`w-1/2 ${isLeft ? "pr-12 text-right" : ""}`}>
          {isLeft && (
            <div
              className={`bg-gray-900 border-2 ${
                TYPE_COLORS[experience.type]
              } rounded-xl p-5`}
            >
              <div className="flex items-center justify-end gap-2 mb-2">
                <h3 className="text-xl font-bold text-primary">
                  {experience.title}
                </h3>
                <IconComponent className="text-primary text-xl" />
              </div>
              <p className="text-white font-semibold">{experience.organization}</p>
              <p className="text-gray-400 text-sm mt-1">
                {formatDate(experience.startDate)} —{" "}
                {formatDate(experience.endDate)}
              </p>
              {experience.description && (
                <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                  {experience.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center dot */}
        <div className="timeline-dot" />

        {/* Right content */}
        <div className={`w-1/2 ${!isLeft ? "pl-12" : ""}`}>
          {!isLeft && (
            <div
              className={`bg-gray-900 border-2 ${
                TYPE_COLORS[experience.type]
              } rounded-xl p-5`}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="text-primary text-xl" />
                <h3 className="text-xl font-bold text-primary">
                  {experience.title}
                </h3>
              </div>
              <p className="text-white font-semibold">{experience.organization}</p>
              <p className="text-gray-400 text-sm mt-1">
                {formatDate(experience.startDate)} —{" "}
                {formatDate(experience.endDate)}
              </p>
              {experience.description && (
                <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                  {experience.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: left-aligned */}
      <div className="md:hidden flex w-full">
        <div className="timeline-dot" style={{ left: "20px" }} />
        <div className="ml-12 flex-1">
          <div
            className={`bg-gray-900 border-2 ${
              TYPE_COLORS[experience.type]
            } rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="text-primary text-lg" />
              <h3 className="text-lg font-bold text-primary">
                {experience.title}
              </h3>
            </div>
            <p className="text-white font-semibold text-sm">
              {experience.organization}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {formatDate(experience.startDate)} —{" "}
              {formatDate(experience.endDate)}
            </p>
            {experience.description && (
              <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                {experience.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceData[];
}) {
  if (experiences.length === 0) return null;

  return (
    <section id="timeline" className="mt-20 md:mt-32 pt-5">
      <h1 className="text-4xl lg:text-5xl text-white font-bold uppercase text-center px-5">
        <span className="text-shadow text-primary">My </span>Experience
      </h1>
      <div className="container max-w-5xl mx-auto px-6 mt-14 relative">
        {/* Timeline center line */}
        <div className="timeline-line" />

        {experiences.map((exp, index) => (
          <TimelineEntry key={exp._id} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
}
