"use client";

import { useMemo } from "react";
import SectionShell from "./SectionShell";

const CATEGORY_ORDER = ["Languages", "Frontend", "Backend", "Databases", "Tools"];

const DEFAULT_CATEGORY = "Tools";

interface SkillData {
  _id: string;
  name: string;
  icon: string;
  percentage: number;
  category?: string;
  order: number;
}

export default function Skills({ skills }: { skills: SkillData[] }) {

  const groups = useMemo(() => {
    const buckets: Record<string, SkillData[]> = {};

    skills.forEach((skill) => {
      const key = CATEGORY_ORDER.includes(skill.category || "")
        ? (skill.category as string)
        : DEFAULT_CATEGORY;
      (buckets[key] ||= []).push(skill);
    });

    return CATEGORY_ORDER.filter((name) => buckets[name]?.length).map((name) => ({
      name,
      items: [...buckets[name]].sort((a, b) => a.order - b.order),
    }));
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <SectionShell
      id="skills"
      no="03"
      title="Stack"
      tagline="The tools I use to turn ideas into solutions"
    >
      <div>
        {groups.map((group, i) => (
          <div
            key={group.name}
            className={`lg:flex lg:items-baseline lg:gap-10 py-[18px] lg:py-5 ${
              i === 0 ? "lg:pt-0" : ""
            } ${i === groups.length - 1 ? "pb-0 lg:pb-0" : "border-b v3-rule"}`}
          >
            <span className="block lg:w-[130px] lg:shrink-0 font-mono text-[10px] lg:text-[11px] tracking-[0.2em] uppercase text-[#6A6A6A]">
              {group.name}
            </span>

            <p className="mt-2 lg:mt-0 flex-1 text-[15.5px] lg:text-[16.5px] leading-[1.65] lg:leading-[1.7] text-[#D8D8D8]">
              {group.items.map((skill, s) => (
                <span key={skill._id}>
                  {s > 0 && (
                    <span className="px-2 text-[#5A5A5A]" aria-hidden="true">
                      &middot;
                    </span>
                  )}
                  {skill.name}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
