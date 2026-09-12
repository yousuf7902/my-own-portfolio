"use client";

import { useEffect, useState } from "react";
import FooterBar from "./FooterBar";

interface AboutData {
  firstName: string;
  lastName: string;
  email: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

const LOCATION = "Dhaka, BD";
const TIMEZONE = "Asia/Dhaka";
const REPLY_TIME = "< 24 hours";

function LocalClock() {
  const [time, setTime] = useState<{
    hour: string;
    minute: string;
    period: string;
  } | null>(null);

  useEffect(() => {

    const format = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const tick = () => {
      const parts = format.formatToParts(new Date());
      const part = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? "";
      setTime({
        hour: part("hour"),
        minute: part("minute"),
        period: part("dayPeriod"),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono text-[12.5px] lg:text-[13px] text-[#D8D8D8]"
      suppressHydrationWarning
    >
      {time?.hour ?? "--"}
      <span className="text-primary clock-colon">:</span>
      {time?.minute ?? "--"}
      {time ? ` ${time.period}` : ""}
    </span>
  );
}

function DetailRow({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-3 lg:py-3.5 border-b v3-rule ${className}`}
    >
      <span className="font-mono text-[10px] lg:text-[11px] tracking-[0.18em] uppercase text-[#5A5A5A]">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function Footer({ about }: { about: AboutData }) {
  const socials: { label: string; href: string }[] = [
    { label: "github", href: about.socials.github },
    { label: "linkedin", href: about.socials.linkedin },
    { label: "facebook", href: about.socials.facebook },
  ].filter((s) => Boolean(s.href));

  return (
    <footer>

      <div id="contact" className="shell mt-[52px] lg:mt-[120px]">
        <div className="pt-[34px] lg:pt-[60px] border-t border-[#2E2E2E]">
          <h2 className="font-mono text-[10.5px] lg:text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
            06 &mdash; Contact
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-[60px] mt-5 lg:mt-[34px]">

            <div className="min-w-0">
              <p className="text-[clamp(2rem,9vw,2.375rem)] sm:text-[3rem] lg:text-[3.75rem] font-bold leading-[1.04] lg:leading-[1.02] tracking-[-0.035em] text-[#F2F2F2]">
                Let&rsquo;s build
                <br />
                something.
              </p>
              <a
                href={`mailto:${about.email}`}
                className="tap inline-block max-w-full mt-5 lg:mt-[30px] pb-[7px] lg:pb-2 border-b border-[#46330F] font-mono text-[clamp(0.9375rem,4.2vw,1.5625rem)] font-medium lg:tracking-[-0.01em] text-primary break-all hover:border-primary transition-colors"
              >
                {about.email}
              </a>
            </div>

            <div className="w-full lg:w-[300px] lg:shrink-0">
              <DetailRow label="Based in" className="hidden lg:flex">
                <span className="font-mono text-[13px] text-[#D8D8D8]">
                  {LOCATION}
                </span>
              </DetailRow>
              <DetailRow label="Local time">
                <LocalClock />
              </DetailRow>
              <DetailRow label="Replies in">
                <span className="font-mono text-[12.5px] lg:text-[13px] text-[#D8D8D8]">
                  {REPLY_TIME}
                </span>
              </DetailRow>

              {socials.length > 0 && (
                <div className="flex flex-wrap gap-x-5 gap-y-2 lg:gap-x-[26px] pt-4 lg:pt-[18px]">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap font-mono text-xs lg:text-[12.5px] text-[#9C9C9C] hover:text-primary transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterBar firstName={about.firstName} lastName={about.lastName} />
    </footer>
  );
}
