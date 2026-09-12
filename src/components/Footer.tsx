"use client";

import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa6";

interface AboutData {
  firstName: string;
  lastName: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

export default function Footer({ about }: { about: AboutData }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="mt-20 md:mt-32">
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="text-4xl md:text-5xl uppercase font-bold">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="text-white">{about.firstName}</span>{" "}
            <span className="text-primary text-shadow">{about.lastName}</span>
          </button>
        </div>
        <div className="text-white text-xl flex flex-col items-center md:flex-row md:space-x-6 font-bold">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2 hover:bg-primary hover:rounded-2xl transition-all"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="p-2 hover:bg-primary hover:rounded-2xl transition-all"
          >
            About Me
          </button>
          <button
            onClick={() => scrollTo("projects")}
            className="p-2 hover:bg-primary hover:rounded-2xl transition-all"
          >
            Projects
          </button>
          <button
            onClick={() => scrollTo("achievements")}
            className="p-2 hover:bg-primary hover:rounded-2xl transition-all"
          >
            Achievements
          </button>
        </div>
        <div className="text-3xl lg:text-4xl text-primary space-x-10">
          {about.socials.facebook && (
            <a href={about.socials.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.linkedin && (
            <a href={about.socials.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.github && (
            <a href={about.socials.github} target="_blank" rel="noopener noreferrer">
              <FaGithub className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.email && (
            <a href={`mailto:${about.socials.email}`} target="_blank" rel="noopener noreferrer">
              <FaEnvelope className="inline hover:text-white transition-colors" />
            </a>
          )}
        </div>
      </div>
      <div className="bg-black mt-14 p-5 text-white font-bold text-center">
        <p>
          Copyright &copy; {new Date().getFullYear()} by {about.firstName}{" "}
          <span className="text-primary text-shadow">{about.lastName}</span> | All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
