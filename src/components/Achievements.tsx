"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  FaCode,
  FaTrophy,
  FaDiagramProject,
  FaGithub,
  FaStar,
  FaUsers,
  FaLaptopCode,
  FaCertificate,
  FaBullseye,
  FaChartLine,
  FaAward,
  FaGraduationCap,
} from "react-icons/fa6";
import { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  FaCode,
  FaTrophy,
  FaDiagramProject,
  FaGithub,
  FaStar,
  FaUsers,
  FaLaptopCode,
  FaCertificate,
  FaBullseye,
  FaChartLine,
  FaAward,
  FaGraduationCap,
};

interface AchievementData {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

function Counter({
  target,
  suffix,
  isVisible,
}: {
  target: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [target, isVisible]);

  useEffect(() => {
    return animate();
  }, [animate]);

  return (
    <span className="text-4xl md:text-5xl font-bold text-primary">
      {count}
      {suffix}
    </span>
  );
}

export default function Achievements({
  achievements,
}: {
  achievements: AchievementData[];
}) {
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

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="mt-20 md:mt-32 pt-5" ref={sectionRef}>
      <h1 className="text-4xl lg:text-5xl text-white font-bold uppercase text-center px-5">
        <span className="text-shadow text-primary">My </span>Achievements
      </h1>
      <div className="container max-w-7xl mx-auto px-6 mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => {
          const IconComponent = ICON_MAP[achievement.icon] || FaCode;

          return (
            <div
              key={achievement._id}
              className="achievement-card rounded-xl p-6 flex flex-col items-center text-center gap-3"
            >
              <IconComponent className="text-3xl md:text-4xl text-primary" />
              <Counter
                target={achievement.value}
                suffix={achievement.suffix}
                isVisible={isVisible}
              />
              <span className="text-white font-semibold text-sm md:text-base uppercase tracking-wider">
                {achievement.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
