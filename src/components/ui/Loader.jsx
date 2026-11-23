import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { profile } from "../../data/profile";

const MIN_TIME = 1000; // ms – long enough to read, short enough not to annoy
const MAX_TIME = 6000; // ms – never trap people behind a slow network

/**
 * Big 0→100 counter driven by real asset progress (drei useProgress),
 * then a curtain wipe that reveals the hero.
 */
export default function Loader({ wait3D, reduced, onDone }) {
  const { progress, active, loaded, errors } = useProgress();
  const [fontsReady, setFontsReady] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [forced, setForced] = useState(false);
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);
  const target = useRef(0);
  const shown = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    document.getElementById("boot")?.remove(); // the static HTML loading screen hands over to this one
    document.fonts.ready.then(() => setFontsReady(true));
    const a = setTimeout(() => setTimeUp(true), MIN_TIME);
    const b = setTimeout(() => setForced(true), MAX_TIME);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const assetsDone = !wait3D || (loaded > 0 && !active && progress >= 100) || errors.length > 0;
  const done = forced || (fontsReady && timeUp && assetsDone);

  // Counter target: real progress, capped below 100 until everything is ready.
  useEffect(() => {
    const real = wait3D ? progress : 100;
    target.current = done ? 100 : Math.min(real, 92);
  }, [progress, wait3D, done]);

  // Animate the visible number toward the target, then wipe.
  useEffect(() => {
    let raf;
    const start = performance.now();
    let last = start;
    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      // a little time-based drift so the counter never sits at 0
      const drift = Math.min(((now - start) / MIN_TIME) * 60, 60);
      const goal = Math.max(target.current, finished.current ? 100 : Math.min(drift, target.current + 40, 92));
      // frame-rate independent easing, so slow devices finish at the same time
      shown.current += (goal - shown.current) * (1 - Math.exp(-dt * 5.5));
      if (goal === 100 && 100 - shown.current < 1.5) shown.current = 100;
      const value = Math.min(100, Math.round(shown.current));
      if (numRef.current) numRef.current.textContent = String(value).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown.current / 100})`;
      if (target.current === 100 && shown.current >= 100 && !finished.current) {
        finished.current = true;
        if (numRef.current) numRef.current.textContent = "100";
        outro();
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outro = () => {
    // Measure every scroll animation now, while the curtain still hides the page,
    // so nothing has to recalculate (and stutter) once the site is revealed.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    const root = rootRef.current;
    if (!root) return onDone();
    if (reduced) {
      gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: onDone });
      return;
    }
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(root.querySelectorAll("[data-loader-fade]"), { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.04 })
      .to(root.querySelector("[data-curtain]"), { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" }, "-=0.15")
      .set(root, { autoAlpha: 0 });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120]"
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div data-curtain className="absolute inset-0 bg-surface" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
        <div className="shell flex h-full flex-col justify-between py-6 md:py-10">
          <div className="flex justify-between overflow-hidden">
            <span data-loader-fade className="label text-ink">
              {profile.name}
            </span>
            <span data-loader-fade className="label">
              Portfolio / {new Date().getFullYear()}
            </span>
          </div>

          <div className="overflow-hidden">
            <div data-loader-fade className="flex items-end justify-between gap-6">
              <span className="label max-w-[16rem]">Loading scenes, models and type</span>
              <span
                ref={numRef}
                className="font-display font-semibold tabular-nums leading-[0.8] tracking-[-0.04em] text-ink"
                style={{ fontSize: "clamp(6rem, 24vw, 22rem)" }}
              >
                000
              </span>
            </div>
          </div>

          <div className="h-0.5 w-full bg-line">
            <div ref={barRef} className="h-0.5 w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
