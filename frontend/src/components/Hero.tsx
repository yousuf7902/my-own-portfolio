"use client";

import Image from "next/image";
import TypeWriter from "./TypeWriter";

interface AchievementData {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  order: number;
}

interface AboutData {
  greeting: string;
  greetingSuffix: string;
  firstName: string;
  lastName: string;
  roles: string[];
  heroBio: string;
  email: string;
  resumeLink: string;
  profileImage: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

const SOCIAL_LINK =
  "tap font-mono text-[12.5px] text-[#9C9C9C] hover:text-primary transition-colors";

function ArrowRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v13" />
      <path d="m7 12 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}

export default function Hero({
  about,
  achievements = [],
}: {
  about: AboutData;
  achievements?: AchievementData[];
}) {

  const stats = [...achievements].sort((a, b) => a.order - b.order).slice(0, 3);

  const socials: { label: string; href: string }[] = [
    { label: "github", href: about.socials.github },
    { label: "linkedin", href: about.socials.linkedin },
    { label: "facebook", href: about.socials.facebook },
    {
      label: "email",
      href: about.socials.email ? `mailto:${about.socials.email}` : "",
    },
  ].filter((s) => Boolean(s.href));

  return (
    <header className="shell pt-8 sm:pt-10 lg:pt-[84px] pb-2 lg:pb-[92px]">

      <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">

        <div className="flex flex-col items-center lg:items-start gap-5 flex-1 min-w-0">

          <div className="flex flex-col items-center lg:items-start gap-1">
            <span className="font-mono text-[10.5px] lg:text-[11.5px] font-medium tracking-[0.26em] uppercase text-primary">
              Hi, I&rsquo;m
            </span>
            <p className="mt-[5px] lg:mt-1.5 text-[54px] sm:text-[4rem] md:text-[4.75rem] lg:text-[5rem] xl:text-[6rem] font-extrabold uppercase leading-[0.86] lg:leading-[0.85] tracking-[-0.04em] lg:tracking-[-0.045em] text-[#F2F2F2] text-center lg:text-left">
              {about.firstName}
              <br />
              <span className="name-outline">{about.lastName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <span className="w-[18px] lg:w-6 h-0.5 bg-primary shrink-0" />
            <h3 className="font-mono text-base lg:text-xl font-medium text-[#E5E5E5]">
              <TypeWriter words={about.roles} />
            </h3>
          </div>

          <p className="max-w-[545px] text-[15px] lg:text-[17px] leading-[1.75] text-[#9e9e9e] text-center lg:text-left text-pretty">
            {about.heroBio}
          </p>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 lg:gap-[30px] w-full md:w-auto mt-1.5 lg:mt-2">
            <a
              href={`mailto:${about.email}`}
              className="flex items-center justify-center md:justify-start gap-2.5 h-[50px] md:h-auto md:py-[13px] md:px-[22px] rounded bg-primary text-bg_primary font-mono text-[12.5px] lg:text-[13px] font-bold tracking-[0.1em] uppercase hover:bg-[#ff8a2a] transition-colors"
            >
              Hire me
              <ArrowRight />
            </a>
            <a
              href={about.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="tap flex items-center justify-center md:justify-start gap-2.5 h-[50px] md:h-auto rounded md:rounded-none border border-hairline md:border-0 md:border-b md:border-[#4A4A4A] md:pb-1 font-mono text-[12.5px] lg:text-[13px] tracking-[0.1em] uppercase text-[#C9C9C9] hover:text-primary hover:border-primary transition-colors"
            >
              Resume
              <ArrowDown />
            </a>
          </div>

          {socials.length > 0 && (
            <div className="flex flex-col lg:flex-row-reverse items-center gap-3.5 lg:gap-6 w-full max-w-[568px] mt-2.5 lg:mt-6">

              <div className="flex lg:contents items-center gap-4 w-full">
                <span className="flex-1 lg:hidden h-0.5 bg-[#2A2A2A]" />
                <span className="font-mono text-[10.5px] lg:text-[11px] tracking-[0.2em] uppercase text-[#5A5A5A] whitespace-nowrap">
                  Find me
                </span>
                <span className="flex-1 h-0.5 bg-[#2A2A2A]" />
              </div>

              <div className="flex lg:contents flex-wrap justify-center gap-5 lg:gap-6">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={SOCIAL_LINK}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-8 lg:gap-[50px] w-full max-w-[420px] lg:w-[460px] lg:max-w-none lg:shrink-0 mx-auto">
          <div className="relative">
            <div
              className="absolute -inset-3.5 lg:-inset-4 rounded-full border border-hairline"
              aria-hidden="true"
            />
            <Image
              src={about.profileImage}
              alt={`${about.firstName} ${about.lastName}`}
              width={380}
              height={380}
              className="relative w-64 h-64 md:w-80 md:h-80 xl:w-[380px] xl:h-[380px] border-[3px] p-2 border-primary rounded-full object-cover user-img"
              style={{ objectPosition: "center 22%" }}
              priority
            />
          </div>

          {stats.length > 0 && (
            <div className="flex items-stretch w-full px-1.5 lg:px-2 py-[18px] lg:py-5 rounded-[18px] bg-surface border border-hairline">
              {stats.map((stat, i) => (
                <div key={stat._id} className="flex flex-1 items-stretch min-w-0">
                  {i > 0 && <span className="w-px bg-hairline shrink-0" />}
                  <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 px-1">
                    <span className="font-mono text-2xl lg:text-[27px] font-bold leading-none text-primary">
                      {stat.value}
                      <span className="text-[15px] lg:text-[17px]">
                        {stat.suffix}
                      </span>
                    </span>
                    <span className="font-mono text-[9px] lg:text-[10px] tracking-[0.1em] lg:tracking-[0.12em] uppercase text-[#7a7a7a] text-center text-balance">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
