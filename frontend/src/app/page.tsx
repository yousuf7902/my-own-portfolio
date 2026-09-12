import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Certifications from "@/components/Certifications";
import WritingPromo, { PROMO_LIMIT } from "@/components/WritingPromo";
import Footer from "@/components/Footer";
import {
  getAboutData,
  getSkillsData,
  getProjectsData,
  getAchievementsData,
  getExperiencesData,
  getCertificationsData,
  getWritingsData,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    about,
    skills,
    projects,
    achievements,
    experiences,
    certifications,
    writings,
  ] = await Promise.all([
    getAboutData(),
    getSkillsData(),
    getProjectsData(),
    getAchievementsData(),
    getExperiencesData(),
    getCertificationsData(),
    getWritingsData(),
  ]);

  return (
    <div className="v3-root font-grotesk">
      <Navbar about={about} />

      <Hero about={about} achievements={achievements} />

      <main>
        <ExperienceTimeline experiences={experiences} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Certifications certifications={certifications} />

        <WritingPromo
          writings={writings.items}
          total={writings.totalPublished}
        />
      </main>

      <Footer about={about} />
    </div>
  );
}
