import { useEffect, useState } from "react";
import { profile } from "../../data/profile";
import { scrollTo } from "../../hooks/useLenis";
import MagneticButton from "../ui/MagneticButton";

function LocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
     
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-10">
      <div className="shell grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label">Local time — {profile.location}</p>
          <p className="mt-2 font-mono text-2xl">
            <LocalTime />
          </p>
        </div>
        <nav aria-label="Social" className="md:col-span-4">
          <p className="label">Elsewhere</p>
          <ul className="mt-2 space-y-1">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link-wipe">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-start md:col-span-4 md:justify-end">
          <MagneticButton
            variant="round"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
          >
            Back
            <br />
            to top ↑
          </MagneticButton>
        </div>
      </div>

      <div className="shell mt-12 flex flex-wrap justify-between gap-2 border-t border-line py-4">
        <p className="label">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="label">Built with React, Three.js &amp; GSAP — designed and coded by {profile.shortName}</p>
      </div>

      {/* Giant wordmark, cropped by the bottom edge */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p
          className="translate-y-[22%] whitespace-nowrap text-center font-display font-semibold uppercase leading-[0.8] tracking-[-0.05em] text-ink"
          style={{ fontSize: "clamp(4rem, 20vw, 26rem)" }}
        >
          {profile.shortName}
        </p>
      </div>
    </footer>
  );
}
