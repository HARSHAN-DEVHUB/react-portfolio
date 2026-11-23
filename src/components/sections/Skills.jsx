import { Suspense, lazy, useState } from "react";
import { skillGroups } from "../../data/skills";
import { useSite } from "../../context/SiteContext";
import SectionHeader from "../ui/SectionHeader";
import RevealText from "../ui/RevealText";

const SkillSphere = lazy(() => import("../canvas/SkillSphere"));

const swatch = {
  accent: "bg-accent",
  accent2: "bg-accent-2",
  ink: "bg-ink",
  muted: "bg-muted",
  dark: "bg-surface border border-line-strong",
};

export default function Skills() {
  const { webgl, reduced } = useSite();
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  const shown = active ? skillGroups.filter((g) => g.id === active) : skillGroups;

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader index={2} label="Skills" aside="Drag the sphere" />
      </div>

      <div className="shell mt-10 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <RevealText as="h2" id="skills-title" className="display-xl">
            The
            <br />
            stack.
          </RevealText>
          <p className="mt-6 max-w-sm text-muted">
            What I reach for when something has to ship and stay secure. Pick a group to isolate it — hover a tile for the level.
          </p>

          <div className="mt-10 border-t border-line" role="group" aria-label="Filter skills by group">
            {skillGroups.map((g, i) => {
              const on = active === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setActive(on ? null : g.id)}
                  aria-pressed={on}
                  className={`group flex w-full items-center gap-4 border-b border-line py-4 text-left transition-colors duration-300 ${
                    active && !on ? "text-muted" : "text-ink"
                  }`}
                >
                  <span className="label w-8">0{i + 1}</span>
                  <span className={`size-3 shrink-0 ${swatch[g.tone]}`} aria-hidden="true" />
                  <span className="font-display text-2xl font-medium tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2">
                    {g.label}
                  </span>
                  <span className="label ml-auto">{on ? "Showing" : `${g.skills.length}`}</span>
                </button>
              );
            })}
          </div>

          {/* Plain list — always readable, also without WebGL */}
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Skills">
            {shown.flatMap((g) =>
              g.skills.map((s) => (
                <li
                  key={s.name}
                  onPointerEnter={() => setHovered(s.name)}
                  onPointerLeave={() => setHovered(null)}
                  className={`tag transition-colors duration-300 ${hovered === s.name ? "border-accent text-accent" : ""}`}
                >
                  {s.name}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative aspect-square max-h-[82vh] w-full border border-line lg:sticky lg:top-[9vh]">
            {webgl ? (
              <Suspense fallback={null}>
                <SkillSphere
                  className="absolute inset-0"
                  hovered={hovered}
                  setHovered={setHovered}
                  activeGroup={active}
                  reduced={reduced}
                />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center p-10">
                <p className="display-md text-center text-muted">{skillGroups.reduce((n, g) => n + g.skills.length, 0)} tools, five groups.</p>
              </div>
            )}
            <span className="label pointer-events-none absolute left-4 top-4">Fig. 02</span>
            <span className="label pointer-events-none absolute bottom-4 right-4">Drag / Hover</span>
          </div>
        </div>
      </div>
    </section>
  );
}
