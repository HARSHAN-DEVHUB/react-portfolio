import { Suspense, lazy, useLayoutEffect, useRef, useState } from "react";
import { experience } from "../../data/experience";
import { useSite } from "../../context/SiteContext";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import SectionHeader from "../ui/SectionHeader";
import RevealText from "../ui/RevealText";

const Experience3D = lazy(() => import("../canvas/Experience3D"));

export default function Experience() {
  const { webgl, reduced } = useSite();
  const listRef = useRef(null);
  const progressRef = useRef(0);
  const [layout, setLayout] = useState({ nodes: [], height: 0 });

  // Measure where each node sits so the 3D spine passes exactly through them.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      const nodes = [...list.querySelectorAll("[data-node]")].map((n) => {
        const r = n.getBoundingClientRect();
        return Math.round(r.top + r.height / 2 - top);
      });
      setLayout({ nodes, height: Math.round(list.offsetHeight) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Drawing progress + entries popping in.
  useLayoutEffect(() => {
    const list = listRef.current;
    const st = ScrollTrigger.create({
      trigger: list,
      start: "top 70%",
      end: "bottom 70%",
      onUpdate: (self) => (progressRef.current = self.progress),
    });
    const tweens = reduced
      ? []
      : [...list.querySelectorAll("[data-entry]")].map((el) =>
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: 40, clipPath: "inset(0% 0% 0% 100%)" },
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            }
          )
        );
    return () => {
      st.kill();
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [reduced]);

  return (
    <section id="experience" aria-labelledby="exp-title" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader index={4} label="Experience" aside="2021 — Now" />
      </div>

      <div className="shell mt-10 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[14vh]">
            <RevealText as="h2" id="exp-title" className="display-xl">
              Where
              <br />
              I've <span className="text-outline">been.</span>
            </RevealText>
            <p className="mt-6 max-w-xs text-muted">From a cyber-crime cell to client work to a UK master's. Each step added a layer.</p>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          {/* 3D spine column */}
          <div className="absolute bottom-0 left-0 top-0 w-16 md:w-20">
            {webgl && layout.height > 0 ? (
              <Suspense fallback={null}>
                <Experience3D
                  className="absolute inset-0"
                  nodes={layout.nodes}
                  height={layout.height}
                  progressRef={progressRef}
                  reduced={reduced}
                />
              </Suspense>
            ) : (
              <div className="absolute bottom-0 left-1/2 top-0 w-px bg-line-strong" />
            )}
          </div>

          <ol ref={listRef} className="relative">
            {experience.map((item, i) => (
              <li key={i} className="relative grid grid-cols-[4rem_1fr] pb-16 md:grid-cols-[5rem_1fr] md:pb-24">
                <span data-node className="mt-3 block h-3 justify-self-center" aria-hidden="true" />
                <div data-entry>
                  <p className="label">
                    <span className="text-ink">{item.dates}</span>
                    <span className="mx-2">/</span>
                    {item.kind === "education" ? "Education" : "Work"}
                  </p>
                  <h3 className="display-md mt-3">{item.role}</h3>
                  <p className="mt-1 text-muted">{item.org}</p>
                  <ul className="mt-5 space-y-2 border-t border-line pt-4">
                    {item.points.map((pt, j) => (
                      <li key={j} className="flex gap-3 text-[0.98rem]">
                        <span className="mt-[0.6em] inline-block size-1.5 shrink-0 bg-accent" aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
