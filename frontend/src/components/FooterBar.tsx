const TAGLINE_LEAD = "Turning ideas into ";
const TAGLINE_ACCENT = "digital reality";

export default function FooterBar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="mt-11 lg:mt-[90px] bg-bg_primary">
      <div className="shell">

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-5 lg:pt-[26px] pb-[34px] lg:pb-10 border-t border-[#2E2E2E]">
          <span className="text-[clamp(0.6875rem,3vw,0.75rem)] lg:text-[15px] font-medium whitespace-nowrap text-[#C9C9C9]">
            {TAGLINE_LEAD}
            <span className="text-primary">{TAGLINE_ACCENT}</span>
          </span>
          <span className="font-mono text-[clamp(0.5625rem,2.3vw,0.625rem)] lg:text-[11.5px] tracking-[0.04em] lg:tracking-[0.1em] whitespace-nowrap text-[#5A5A5A]">
            &copy; {new Date().getFullYear()} {firstName} {lastName}
          </span>
        </div>
      </div>
    </div>
  );
}
