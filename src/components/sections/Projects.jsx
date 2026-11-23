import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { projects, moreProjects } from "../../data/projects";
import { profile } from "../../data/profile";
import { useSite } from "../../context/SiteContext";
import { useFinePointer, useIsDesktop } from "../../hooks/useIsMobile";
import { startScroll, stopScroll } from "../../hooks/useLenis";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { makeCover } from "../../lib/cover";
import { distortionStore } from "../canvas/distortionStore";
import SectionHeader from "../ui/SectionHeader";
import MagneticButton from "../ui/MagneticButton";

const PERSPECTIVE = 1200;
const num = (i) => String(i + 1).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index, cover, horizontal, onOpen, distort }) {
  const fine = useFinePointer();
  const { reduced } = useSite();
  const tilt = fine && !reduced;
  const wrapRef = useRef(null);
  const previewRef = useRef(null);
  const imgRef = useRef(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  // Projected corners of the tilted preview so the WebGL plane matches it exactly.
  const getQuad = () => {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const el = previewRef.current;
    if (!wrap || !el) return null;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const cx = wrap.left + wrap.width / 2;
    const cy = wrap.top + wrap.height / 2;
    const ax = (srx.get() * Math.PI) / 180;
    const ay = (sry.get() * Math.PI) / 180;
    return [
      [-w / 2, -h / 2],
      [w / 2, -h / 2],
      [w / 2, h / 2],
      [-w / 2, h / 2],
    ].map(([x, y]) => {
      const x1 = x * Math.cos(ay);
      const z1 = -x * Math.sin(ay);
      const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
      const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
      const s = PERSPECTIVE / (PERSPECTIVE - z2);
      return [cx + x1 * s, cy + y2 * s];
    });
  };

  const onMove = (e) => {
    if (!tilt || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 9);
    rx.set(-py * 7);
  };
  const onEnter = () => {
    if (distort && cover) distortionStore.enter(imgRef.current, cover, getQuad);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    if (distort) distortionStore.leave(imgRef.current);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <article
      className={`group flex shrink-0 flex-col ${horizontal ? "h-full w-[min(64vw,1040px)]" : "w-full"}`}
      aria-labelledby={`p-${project.slug}`}
    >
      <div
        ref={wrapRef}
        className={`relative ${horizontal ? "min-h-0 flex-1" : "aspect-[16/11]"}`}
        style={{ perspective: PERSPECTIVE }}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <motion.button
          ref={previewRef}
          type="button"
          onClick={() => onOpen(index)}
          data-cursor="view"
          data-cursor-label="View"
          aria-label={`Open case study: ${project.name}`}
          className="absolute inset-0 block overflow-hidden border border-line bg-surface"
          style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        >
          {cover ? (
            <img
              ref={imgRef}
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-[transform,opacity] duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
          ) : (
            <div ref={imgRef} className="h-full w-full" />
          )}
          <span className="label absolute left-4 top-4 !text-ink">({num(index)})</span>
        </motion.button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <h3 id={`p-${project.slug}`} className="display-md">
            <button type="button" onClick={() => onOpen(index)} className="link-wipe text-left" data-cursor="view" data-cursor-label="Read">
              {project.name}
            </button>
          </h3>
          <p className="mt-2 max-w-lg text-muted">{project.oneLiner}</p>
        </div>
        <div className="flex flex-col gap-3 md:col-span-5 md:items-end md:text-right">
          <p className="font-mono text-sm text-accent">{project.impact}</p>
          <ul className="flex flex-wrap gap-1.5 md:justify-end" aria-label="Stack">
            {project.stack.slice(0, 4).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <div className="flex gap-5">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" onClick={stop} className="label link-wipe !text-ink">
                Live ↗
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" onClick={stop} className="label link-wipe !text-ink">
                Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Case-study modal                                                     */
/* ------------------------------------------------------------------ */
function CaseStudy({ index, covers, onClose, onNav }) {
  const project = index === null ? null : projects[index];
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement;
    stopScroll();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      startScroll();
      lastFocus.current?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project === null]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="case"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
          data-lenis-prevent
          className="fixed inset-0 z-[85] overflow-y-auto bg-bg"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="shell sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/85 py-4 backdrop-blur-md">
            <span className="label">
              Case study <span className="text-ink">{num(index)}</span> / {String(projects.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-6">
              <button onClick={() => onNav(-1)} className="label link-wipe !text-ink" aria-label="Previous project">
                ← Prev
              </button>
              <button onClick={() => onNav(1)} className="label link-wipe !text-ink" aria-label="Next project">
                Next →
              </button>
              <button ref={closeRef} onClick={onClose} className="label border border-line-strong px-3 py-2 !text-ink transition-colors hover:border-accent hover:!text-accent">
                Close [Esc]
              </button>
            </div>
          </div>

          <motion.div
            key={project.slug}
            className="shell pb-24 pt-12 md:pt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label">({num(index)}) — {project.year}</p>
            <h2 id="case-title" className="display-xl mt-4 max-w-[14ch]">
              {project.name}
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">{project.oneLiner}</p>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
              <div>
                <dt className="label">Role</dt>
                <dd className="mt-2">{project.role}</dd>
              </div>
              <div>
                <dt className="label">Year</dt>
                <dd className="mt-2">{project.year}</dd>
              </div>
              <div>
                <dt className="label">Result</dt>
                <dd className="mt-2 font-mono text-sm text-accent">{project.impact}</dd>
              </div>
              <div>
                <dt className="label">Links</dt>
                <dd className="mt-2 flex gap-4">
                  {project.live && (
                    <a className="link-wipe" href={project.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  {project.repo && (
                    <a className="link-wipe" href={project.repo} target="_blank" rel="noreferrer">
                      Code ↗
                    </a>
                  )}
                  {!project.live && !project.repo && <span className="text-muted">Private</span>}
                </dd>
              </div>
            </dl>

            {covers[project.slug] && (
              <img src={covers[project.slug]} alt="" className="mt-12 aspect-[16/10] w-full border border-line object-cover" />
            )}

            <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {[
                ["A", "Problem", project.problem],
                ["B", "What I built", project.built],
                ["C", "Result", project.result],
              ].map(([k, title, body]) => (
                <section key={k} className="border-t border-line pt-5">
                  <p className="label">
                    <span className="text-ink">{k}</span> — {title}
                  </p>
                  <p className={`mt-5 ${k === "C" ? "font-display text-2xl font-medium leading-tight tracking-[-0.02em]" : "text-muted"}`}>{body}</p>
                </section>
              ))}
            </div>

            <div className="mt-16">
              <p className="label">Stack</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNav(1)}
              className="group mt-24 flex w-full items-end justify-between border-t border-line pt-6 text-left"
              data-cursor="view"
              data-cursor-label="Next"
            >
              <span>
                <span className="label">Next project</span>
                <span className="display-lg mt-2 block transition-colors duration-500 group-hover:text-accent">
                  {projects[(index + 1) % projects.length].name}
                </span>
              </span>
              <span className="display-lg" aria-hidden="true">→</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const { reduced, webgl } = useSite();
  const isDesktop = useIsDesktop();
  const fine = useFinePointer();
  const horizontal = isDesktop && !reduced;
  const distort = webgl && horizontal && fine;

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [covers, setCovers] = useState({});
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all(projects.map((p, i) => makeCover(p, i))).then((urls) => {
      if (alive) setCovers(Object.fromEntries(projects.map((p, i) => [p.slug, urls[i]])));
    });
    return () => {
      alive = false;
    };
  }, []);

  // Pin the section and scroll the track sideways.
  useLayoutEffect(() => {
    if (!horizontal) return;
    const track = trackRef.current;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(track);
    return () => {
      ro.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [horizontal]);

  const nav = (d) => setOpen((i) => (i === null ? i : (i + d + projects.length) % projects.length));

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-title" className="relative">
      <div className={horizontal ? "h-[100svh] overflow-hidden" : "py-24 md:py-36"}>
        <div
          ref={trackRef}
          className={
            horizontal
              ? "flex h-full w-max items-stretch gap-[4vw] px-[var(--gutter)] pb-10 pt-24 will-change-transform"
              : "shell flex flex-col gap-20"
          }
        >
          {/* Intro panel */}
          <div className={`flex shrink-0 flex-col ${horizontal ? "w-[34vw] justify-between" : ""}`}>
            <SectionHeader index={3} label="Selected work" aside={`${projects.length} projects`} />
            <div className={horizontal ? "" : "mt-10"}>
              <h2 id="work-title" className="display-xl">
                Things
                <br />
                I've <span className="text-outline">shipped.</span>
              </h2>
              <p className="mt-6 max-w-sm text-muted">
                Commerce, AI, computer vision and security tooling. Each one: the problem, what I built, what it changed.
              </p>
            </div>
            {horizontal && <p className="label">Keep scrolling →</p>}
          </div>

          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              cover={covers[p.slug]}
              horizontal={horizontal}
              distort={distort}
              onOpen={setOpen}
            />
          ))}

          {/* More builds */}
          <div className={`flex shrink-0 flex-col ${horizontal ? "w-[42vw] justify-between pr-[4vw]" : ""}`}>
            <div>
              <p className="label">More builds</p>
              <ul className="mt-6 border-t border-line">
                {moreProjects.map((m) => (
                  <li key={m.name} className="border-b border-line">
                    {m.href ? (
                      <a href={m.href} target="_blank" rel="noreferrer" className="group block py-5">
                        <MoreRow m={m} />
                      </a>
                    ) : (
                      <div className="py-5">
                        <MoreRow m={m} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <MagneticButton variant="outline" href={profile.socials[0].href} target="_blank" rel="noreferrer">
                Everything on GitHub ↗
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <CaseStudy index={open} covers={covers} onClose={() => setOpen(null)} onNav={nav} />
    </section>
  );
}

function MoreRow({ m }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <div>
        <p className="font-display text-2xl font-medium tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent">
          {m.name} {m.href && <span aria-hidden="true">↗</span>}
        </p>
        <p className="mt-1 text-sm text-muted">{m.note}</p>
      </div>
      <span className="label hidden shrink-0 sm:block">{m.stack}</span>
    </div>
  );
}
