"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaDatabase,
  FaCode,
  FaGitAlt,
  FaDocker,
  FaAws,
} from "react-icons/fa6";
import { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaDatabase,
  FaCode,
  FaGitAlt,
  FaDocker,
  FaAws,
};

interface SkillData {
  _id: string;
  name: string;
  icon: string;
  percentage: number;
  order: number;
}

export default function Skills({ skills }: { skills: SkillData[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (skills.length === 0) return null;

  return (
    <div className="flex-1 text-white mt-14 lg:mt-0" ref={sectionRef}>
      <h1 className="text-4xl font-bold mb-8 text-center lg:text-5xl uppercase" id="skills">
        Technical{" "}
        <span className="text-primary text-shadow">Skills</span>
      </h1>
      <div className="technical-bars max-w-md mx-auto mt-5 px-5 space-y-5 md:max-w-xl lg:max-w-5xl xl:max-w-7xl">
        {skills.map((skill, index) => {
          const IconComponent = ICON_MAP[skill.icon] || FaCode;

          return (
            <div className="bar space-y-1" key={skill._id}>
              <div className="info flex items-center">
                <IconComponent className="text-2xl mr-2" />
                <span className="text-xl truncate">{skill.name}</span>
              </div>
              <div className="progress-line w-full h-3 rounded-lg bg-gray-950 relative">
                <div
                  className="h-3 bg-primary rounded-lg relative skill-bar-fill"
                  style={{
                    maxWidth: isVisible ? `${skill.percentage}%` : "0%",
                    animationDelay: `${index * 0.1}s`,
                    width: isVisible ? `${skill.percentage}%` : "0%",
                  }}
                >
                  <span className="tooltip">{skill.percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
