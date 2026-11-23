import { Suspense, lazy, useLayoutEffect, useRef } from "react";
import { profile } from "../../data/profile";
import { theme } from "../../config/theme";
import { allSkills } from "../../data/skills";
import { useSite } from "../../context/SiteContext";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsap";
import SectionHeader from "../ui/SectionHeader";
import RevealText from "../ui/RevealText";
import AvatarFallback from "../ui/AvatarFallback";

const DeskScene = lazy(() => import("../canvas/DeskScene"));

function Counter({ value, suffix, label }) {
  const numRef = useRef(null);
  const { reduced } = useSite();
  const end = value === "skills" ? allSkills.length : value;

  useLayoutEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (reduced) {
      el.textContent = String(end).padStart(2, "0");
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: end,
      duration: 2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v)).padStart(2, "0");
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, reduced]);

  return (
    <div className="border-t border-line pt-4">
      <div className="flex items-start font-display text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
        <span ref={numRef} className="tabular-nums" aria-hidden="true">
          00
        </span>
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <span className="sr-only">
        {end}
        {suffix}
      </span>
      <p className="label mt-2">{label}</p>
    </div>
  );
}

export default function About() {
  const { webgl, reduced } = useSite();
  const sectionRef = useRef(null);
  const bioRef = useRef(null);
  const progressRef = useRef(0);

  // Scroll progress through the section drives the desk scene's camera.
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => (progressRef.current = self.progress),
    });
    return () => st.kill();
  }, []);

  // Word-by-word highlight of the bio as you scroll.
  useLayoutEffect(() => {
    if (reduced || !bioRef.current) return;
    let splits = [];
    let tweens = [];
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      bioRef.current.querySelectorAll("[data-highlight]").forEach((p) => {
        const split = SplitText.create(p, { type: "words", aria: "none" });
        splits.push(split);
        tweens.push(
          gsap.fromTo(
            split.words,
            // starts at the muted text colour (still AA-readable), lights up to full ink
            { color: theme.textMuted },
            {
              color: theme.textPrimary,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 50%", scrub: true },
            }
          )
        );
      });
    });
    return () => {
      cancelled = true;
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      splits.forEach((s) => s.revert());
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader index={1} label="About" aside="Developer / Security analyst" />
      </div>

      <div className="shell mt-10 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* Sticky desk scene */}
        <div className="relative lg:col-span-5 lg:self-start lg:sticky lg:top-[11vh]">
          <div className="relative h-[56svh] border border-line bg-surface/40 lg:h-[78vh]">
            {webgl ? (
              <Suspense fallback={null}>
                <DeskScene className="absolute inset-0" progressRef={progressRef} reduced={reduced} fallback={<AvatarFallback pose="desk" />} />
              </Suspense>
            ) : (
              <AvatarFallback pose="desk" />
            )}
            <span className="label absolute left-4 top-4">Fig. 01</span>
            <span className="label absolute bottom-4 left-4 right-4 flex justify-between">
              <span>At the desk</span>
              <span>Portsmouth, UK</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealText as="h2" id="about-title" className="display-lg">
            Security brain.
            <br />
            Builder's hands.
          </RevealText>

          <div ref={bioRef} className="mt-12 space-y-8 md:mt-16">
            {profile.bio.map((p, i) => (
              <p
                key={i}
                data-highlight
                className="font-display text-[clamp(1.5rem,2.4vw,2.35rem)] font-medium leading-[1.15] tracking-[-0.02em]"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 flex gap-5 border-l-2 border-accent pl-5">
            <div>
              <p className="label text-ink">Now</p>
              <p className="mt-2 max-w-md text-muted">{profile.currentFocus}</p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24">
            {profile.stats.map((s) => (
              <Counter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
