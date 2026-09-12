"use client";

import { useState } from "react";
import {
  FaBars,
  FaXmark,
} from "react-icons/fa6";

interface AboutData {
  firstName: string;
  lastName: string;
  resumeLink: string;
}

export default function Navbar({ about }: { about: AboutData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="container mx-auto mt-8 rounded-full max-w-lg flex justify-between md:justify-around items-center text-sm gap-5 px-6 py-3 bg-black text-white md:max-w-7xl md:text-lg lg:text-2xl">
        {/* Desktop Left Links */}
        <div className="hidden md:flex md:flex-1 md:justify-evenly">
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
            About
          </button>
          <button
            onClick={() => scrollTo("skills")}
            className="p-2 hover:bg-primary hover:rounded-2xl transition-all"
          >
            Skills
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex gap-2 items-center uppercase font-bold text-lg lg:text-3xl">
          <span>{about.firstName}</span>
          <span className="text-primary text-shadow">{about.lastName}</span>
        </div>

        {/* Desktop Right Links */}
        <div className="hidden md:flex md:flex-1 md:justify-evenly">
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
          <a
            href={about.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-primary rounded-2xl hover:bg-transparent hover:text-primary hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-8 transition-all"
          >
            Resume
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="container max-w-sm mx-auto flex flex-col gap-3 text-xl text-white font-semibold bg-black items-center justify-center">
            <button
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-2 text-center hover:bg-primary hover:rounded-2xl w-full transition-all"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="p-2 text-center hover:bg-primary hover:rounded-2xl w-full transition-all"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="p-2 text-center hover:bg-primary hover:rounded-2xl w-full transition-all"
            >
              Projects
            </button>
            <button
              onClick={() => scrollTo("achievements")}
              className="p-2 text-center hover:bg-primary hover:rounded-2xl w-full transition-all"
            >
              Achievements
            </button>
            <a
              href={about.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-center bg-primary rounded-2xl hover:bg-transparent hover:text-primary hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-8 mb-5 w-full transition-all"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}
