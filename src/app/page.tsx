import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import {
  getAboutData,
  getSkillsData,
  getProjectsData,
  getAchievementsData,
  getExperiencesData,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [about, skills, projects, achievements, experiences] = await Promise.all([
    getAboutData(),
    getSkillsData(),
    getProjectsData(),
    getAchievementsData(),
    getExperiencesData(),
  ]);

  return (
    <>
      {/* Navbar */}
      <Navbar about={about} />

      {/* Hero Section */}
      <Hero about={about} />

      {/* Main Content */}
      <main>
        {/* About & Skills Section */}
        <section id="about" className="mt-10 md:mt-32 pt-1">
          <div className="container mx-auto max-w-7xl mt-20 px-6 flex flex-col justify-between gap-10 mb-16 md:gap-8 lg:gap-32 lg:flex-row lg:mt-36">
            <About about={about} />
            <Skills skills={skills} />
          </div>
        </section>

        {/* Projects Section */}
        <Projects projects={projects} />

        {/* Achievements Section */}
        <Achievements achievements={achievements} />

        {/* Experience Timeline */}
        <ExperienceTimeline experiences={experiences} />
      </main>

      {/* Footer */}
      <Footer about={about} />
    </>
  );
}
