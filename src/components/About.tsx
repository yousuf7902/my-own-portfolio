"use client";

import TypeWriter from "./TypeWriter";

interface AboutData {
  aboutText: string;
  roles: string[];
}

export default function About({ about }: { about: AboutData }) {
  return (
    <div className="px-5 flex flex-col gap-5 text-white flex-1 lg:items-start">
      <h1 className="text-4xl font-bold text-center lg:text-5xl uppercase w-full">
        About<span className="text-primary text-shadow"> Me</span>
      </h1>
      <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-semibold text-center w-full">
        <TypeWriter words={about.roles} />
      </h3>
      <p className="text-xl text-center lg:text-left font-semibold">
        {about.aboutText}
      </p>
    </div>
  );
}
