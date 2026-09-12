"use client";

import { useMemo, useState } from "react";
import SectionShell from "./SectionShell";

const TYPE_LABELS: Record<string, string> = {
  work: "Work",
  education: "Education",
  volunteer: "Volunteer",
};

const TYPE_ORDER = ["work", "volunteer", "education"];

interface ExperienceData {
  _id: string;
  title: string;
  organization: string;
  type: "work" | "education" | "volunteer";
  startDate: string;
  endDate: string | null;
  description: string;
  technologies?: string[];
  icon: string;
  order: number;
}

interface OrgGroup {
  key: string;
  organization: string;
  type: string;
  order: number;
  roles: ExperienceData[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function time(dateStr: string | null): number {
  return dateStr ? new Date(dateStr).getTime() : 0;
}

function groupByOrganization(experiences: ExperienceData[]): OrgGroup[] {
  const groups = new Map<string, OrgGroup>();

  experiences.forEach((exp) => {
    const key = `${exp.type}|${exp.organization.trim().toLowerCase()}`;
    const existing = groups.get(key);

    if (existing) {
      existing.roles.push(exp);
      existing.order = Math.min(existing.order, exp.order);
    } else {
      groups.set(key, {
        key,
        organization: exp.organization.trim(),
        type: exp.type,
        order: exp.order,
        roles: [exp],
      });
    }
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,

      roles: [...group.roles].sort(
        (a, b) =>
          Number(Boolean(a.endDate)) - Number(Boolean(b.endDate)) ||
          time(b.startDate) - time(a.startDate) ||
          a.order - b.order
      ),
    }))
    .sort((a, b) => a.order - b.order);
}

function OrganizationBlock({
  group,
  isFirst,
}: {
  group: OrgGroup;
  isFirst: boolean;
}) {

  const starts = group.roles.map((r) => time(r.startDate)).filter(Boolean);
  const isOngoing = group.roles.some((r) => !r.endDate);
  const ends = group.roles.map((r) => time(r.endDate)).filter(Boolean);
  const spanStart = starts.length
    ? new Date(Math.min(...starts)).toISOString()
    : null;
  const spanEnd =
    isOngoing || !ends.length ? null : new Date(Math.max(...ends)).toISOString();

  return (
    <div
      className={`flex flex-col lg:flex-row lg:gap-10 pt-[22px] lg:pt-[26px] ${
        isFirst ? "" : "mt-[22px] lg:mt-0"
      } border-t v3-rule lg:pb-[26px]`}
    >

      <div className="hidden lg:block w-[190px] shrink-0">
        <div className="font-mono text-[12.5px] text-[#C9C9C9]">
          {formatDate(spanStart)} &mdash; {formatDate(spanEnd)}
        </div>
        <div className="mt-[7px] font-mono text-[10.5px] tracking-[0.18em] uppercase text-[#5A5A5A]">
          {TYPE_LABELS[group.type] || group.type}
        </div>
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-baseline justify-between gap-2.5 lg:justify-start lg:gap-3.5">
          <span className="font-mono text-[11px] lg:text-[12.5px] font-medium tracking-[0.14em] lg:tracking-[0.16em] uppercase text-[#C9C9C9] min-w-0">
            {group.organization}
          </span>
          {group.roles.length > 1 && (
            <span className="font-mono text-[9.5px] lg:text-[10.5px] tracking-[0.14em] lg:tracking-[0.16em] uppercase text-[#5A5A5A] shrink-0">
              {group.roles.length} roles
            </span>
          )}
        </div>

        <div className="role-rail mt-4 lg:mt-5">
          {group.roles.map((role, i) => (
            <div
              key={role._id}
              className={`relative ${
                i < group.roles.length - 1 ? "pb-5 lg:pb-6" : ""
              }`}
            >
              <span
                className={`role-node ${role.endDate ? "" : "current"}`}
                aria-hidden="true"
              />

              <div className="flex items-baseline justify-between gap-2.5 lg:gap-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
                  <h3
                    className={`min-w-0 text-[18px] lg:text-[21px] font-semibold leading-[1.25] lg:tracking-[-0.01em] ${
                      role.endDate ? "text-[#A8A8A8]" : "text-[#F2F2F2]"
                    }`}
                  >
                    {role.title}
                  </h3>
                  {!role.endDate && (
                    <span className="hidden lg:inline font-mono text-[10px] tracking-[0.16em] uppercase text-primary shrink-0">
                      Current
                    </span>
                  )}
                </div>

                <span className="hidden lg:block font-mono text-xs text-[#8E8E8E] shrink-0">
                  {formatDate(role.startDate)} &mdash; {formatDate(role.endDate)}
                </span>
                {!role.endDate && (
                  <span className="lg:hidden font-mono text-[9.5px] tracking-[0.14em] uppercase text-primary shrink-0">
                    Current
                  </span>
                )}
              </div>

              <div className="lg:hidden mt-1.5 font-mono text-[11px] text-[#8E8E8E]">
                {formatDate(role.startDate)} &mdash; {formatDate(role.endDate)}
              </div>

              {role.description && (
                <p className="mt-2.5 lg:mt-3 max-w-[600px] text-sm lg:text-[15px] leading-[1.65] lg:leading-[1.7] text-[#8E8E8E]">
                  {role.description}
                </p>
              )}

              {role.technologies && role.technologies.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 lg:gap-x-[22px] mt-2.5 lg:mt-3.5">
                  {role.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] lg:text-[11.5px] text-[#6A6A6A]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
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
  const [activeType, setActiveType] = useState<string | null>(null);

  const types = useMemo(() => {
    const counts: Record<string, number> = {};
    experiences.forEach((exp) => {
      counts[exp.type] = (counts[exp.type] || 0) + 1;
    });
    return TYPE_ORDER.filter((t) => counts[t]).map(
      (t) => [t, counts[t]] as [string, number]
    );
  }, [experiences]);

  const groups = useMemo(() => {
    const filtered = activeType
      ? experiences.filter((exp) => exp.type === activeType)
      : experiences;
    return groupByOrganization(filtered);
  }, [experiences, activeType]);

  if (experiences.length === 0) return null;

  return (
    <SectionShell
      id="timeline"
      no="01"
      title="Experience"
      lgPt="lg:pt-24"
      tagline="Where I’ve Been. What I’ve Learned. The Journey Behind the Code"
    >
      {types.length > 1 && (
        <div className="v3-tabs pb-6 lg:pb-7">
          <button
            type="button"
            onClick={() => setActiveType(null)}
            className={`v3-tab ${activeType === null ? "active" : ""}`}
          >
            All <span className="n">{experiences.length}</span>
          </button>
          {types.map(([type, count]) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`v3-tab ${activeType === type ? "active" : ""}`}
            >
              {TYPE_LABELS[type] || type} <span className="n">{count}</span>
            </button>
          ))}
        </div>
      )}

      <div>
        {groups.map((group, i) => (
          <OrganizationBlock key={group.key} group={group} isFirst={i === 0} />
        ))}
      </div>
    </SectionShell>
  );
}
