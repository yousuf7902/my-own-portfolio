"use client";

import { useEffect, useState } from "react";
import { FaCode, FaFolder, FaTrophy, FaTimeline } from "react-icons/fa6";
import { fetchSkills, fetchProjects, fetchAchievements, fetchExperiences } from "@/lib/api";

interface Stats {
  skills: number;
  projects: number;
  achievements: number;
  experiences: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    skills: 0,
    projects: 0,
    achievements: 0,
    experiences: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchSkills(),
      fetchProjects(),
      fetchAchievements(),
      fetchExperiences(),
    ]).then(([skills, projects, achievements, experiences]) => {
      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        experiences: Array.isArray(experiences) ? experiences.length : 0,
      });
    });
  }, []);

  const cards = [
    { label: "Skills", count: stats.skills, icon: FaCode, href: "/admin/skills" },
    { label: "Projects", count: stats.projects, icon: FaFolder, href: "/admin/projects" },
    { label: "Achievements", count: stats.achievements, icon: FaTrophy, href: "/admin/achievements" },
    { label: "Timeline", count: stats.experiences, icon: FaTimeline, href: "/admin/experiences" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Welcome to <span className="text-primary">Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a key={card.label} href={card.href} className="admin-card p-6 flex flex-col items-center gap-3">
              <Icon className="text-4xl text-primary" />
              <span className="text-4xl font-bold text-white">{card.count}</span>
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-sm">
                {card.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
