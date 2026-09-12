"use client";

import Image from "next/image";
import TypeWriter from "./TypeWriter";
import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa6";

interface AboutData {
  greeting: string;
  greetingSuffix: string;
  firstName: string;
  lastName: string;
  roles: string[];
  heroBio: string;
  email: string;
  profileImage: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

export default function Hero({ about }: { about: AboutData }) {
  return (
    <header className="container max-w-7xl mx-auto flex flex-col-reverse gap-10 mt-12 md:mt-20 justify-between items-center px-6 lg:flex-row lg:gap-10 xl:gap-12">
      {/* Left Section */}
      <div className="left max-w-3xl flex flex-col justify-center items-center gap-5 px-5 text-white flex-1 lg:items-start">
        <h3 className="text-3xl lg:text-4xl font-bold">
          <span className="text-primary text-shadow">{about.greeting} </span>
          {about.greetingSuffix}
        </h3>
        <p className="text-3xl lg:text-5xl uppercase mt-1 font-bold">
          {about.firstName}{" "}
          <span className="text-primary">{about.lastName}</span>
        </p>
        <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-semibold text-center">
          <TypeWriter words={about.roles} />
        </h3>
        <p className="text-xl text-center lg:text-left font-semibold">
          {about.heroBio}
        </p>
        <a
          href={`mailto:${about.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary mt-5 px-7 py-2 rounded-full text-xl font-semibold hover:bg-black hover:text-primary hover:scale-110 transition-all inline-block"
        >
          Hire Me
        </a>
      </div>

      {/* Right Section */}
      <div className="right flex flex-col gap-5 justify-between items-center">
        <div>
          <Image
            src={about.profileImage}
            alt={`${about.firstName} ${about.lastName}`}
            width={320}
            height={320}
            className="w-72 h-72 md:w-80 md:h-80 border-4 p-2 border-primary rounded-full object-cover shadow-xl user-img"
            priority
          />
        </div>
        <div className="text-2xl lg:text-3xl xl:text-4xl mt-2 space-x-3 text-primary">
          {about.socials.facebook && (
            <a
              href={about.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.linkedin && (
            <a
              href={about.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.github && (
            <a
              href={about.socials.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="inline hover:text-white transition-colors" />
            </a>
          )}
          {about.socials.email && (
            <a
              href={`mailto:${about.socials.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope className="inline hover:text-white transition-colors" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
