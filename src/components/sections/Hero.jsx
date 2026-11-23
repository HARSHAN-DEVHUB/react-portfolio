import { Suspense, lazy, useLayoutEffect, useRef } from "react";
import { profile } from "../../data/profile";
import { useSite } from "../../context/SiteContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { scrollTo } from "../../hooks/useLenis";
import { gsap } from "../../lib/gsap";
import { asset } from "../../lib/device";
import RevealText from "../ui/RevealText";
import MagneticButton from "../ui/MagneticButton";
import AvatarFallback from "../ui/AvatarFallback";

const HeroScene = lazy(() => import("../canvas/HeroScene"));

export default function Hero() {
  const { introDone, webgl, reduced } = useSite();
  const isMobile = useIsMobile();
  const rootRef = useRef(null);

  // Fade/slide in everything that isn't a masked headline line.
  useLayoutEffect(() => {
    const items = rootRef.current?.querySelectorAll("[data-hero-fade]");
    if (!items?.length || reduced) return;
    if (!introDone) {
      gsap.set(items, { autoAlpha: 0, y: 24 });
      return;
    }
    const tween = gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, delay: 0.55 });
    return () => tween.kill();
  }, [introDone, reduced]);

  const [l1, l2, l3] = profile.headline;

  return (
    <section ref={rootRef} id="top" aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden">
      {/* 3D scene — full-bleed on desktop, lower half on mobile */}
      <div className="absolute inset-x-0 bottom-0 h-[58svh] md:inset-0 md:h-auto [mask-image:linear-gradient(to_bottom,black_78%,transparent)]">
        {webgl ? (
          <Suspense fallback={null}>
            <HeroScene
              className="h-full w-full"
              play={introDone}
              isMobile={isMobile}
              reduced={reduced}
              fallback={<AvatarFallback className="md:justify-end md:pr-[10vw]" />}
            />
          </Suspense>
        ) : (
          <AvatarFallback className="md:justify-end md:pr-[10vw]" />
        )}
      </div>

      <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="shell pointer-events-none relative z-10 flex min-h-[100svh] flex-col pb-6 pt-24 md:pb-8 md:pt-32">
        <p data-hero-fade className="label flex flex-wrap gap-x-3">
          <span className="text-ink">{profile.name}</span>
          <span aria-hidden="true">/</span>
          <span>{profile.title}</span>
        </p>

        <RevealText
          as="h1"
          id="hero-title"
          play={introDone}
          delay={0.15}
          stagger={0.11}
          className="mt-5 font-display font-semibold leading-[0.86] tracking-[-0.035em] md:mt-8"
          style={{ fontSize: "clamp(3.5rem, 10vw, 11rem)" }}
        >
          {l1}
          <br />
          <span className="text-outline">{l2}</span>
          <br />
          {l3}
        </RevealText>

        <div className="mt-6 max-w-[30rem] md:mt-10">
          <p data-hero-fade className="text-base text-muted md:text-lg">
            {profile.proof}
          </p>
          <div data-hero-fade className="pointer-events-auto mt-7 flex flex-wrap gap-3">
            <MagneticButton
              variant="solid"
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#work");
              }}
            >
              See the work <span aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton variant="outline" href={asset(profile.contact.resume)} download="Harshan-Babu-Resume.pdf">
              Résumé <span aria-hidden="true">↓</span>
            </MagneticButton>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 pt-10">
          <div data-hero-fade className="flex items-center gap-3 border border-line bg-bg/60 px-4 py-3 backdrop-blur-sm">
            <span className="pulse-dot" aria-hidden="true" />
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em]">{profile.availability}</span>
          </div>

          <div data-hero-fade className="hidden items-center gap-4 md:flex">
            <span className="label">{profile.location}</span>
          </div>

          <a
            data-hero-fade
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#about");
            }}
            className="pointer-events-auto group flex flex-col items-center gap-2"
            aria-label="Scroll to About"
          >
            <span className="label hidden md:block">Scroll</span>
            <span className="relative block h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out)_infinite] bg-accent" />
            </span>
          </a>
        </div>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
