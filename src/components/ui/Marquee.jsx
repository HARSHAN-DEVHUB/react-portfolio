import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { scrollState } from "../../hooks/useLenis";
import { useReducedMotion } from "../../hooks/useIsMobile";

/**
 * Infinite marquee of huge outline words. Base speed is constant; scroll
 * velocity speeds it up and scroll direction flips it.
 */
export default function Marquee({ items, speed = 60 }) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    let x = 0;
    let dir = -1;
    let boost = 0;

    const tick = (_time, deltaMs) => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      const v = scrollState.velocity || 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v) * 0.9, 14) - boost) * 0.08;
      x += dir * (speed * (1 + boost)) * (deltaMs / 1000);
      x = ((x % half) - half) % half; // keep it in [-half, 0)
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reduced, speed]);

  const row = (hidden) =>
    items.map((word, i) => (
      <span key={`${hidden}-${i}`} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
        <span
          className={`px-[0.18em] font-display font-semibold tracking-[-0.03em] transition-colors duration-500 ${
            i % 3 === 1 ? "text-ink" : "text-outline hover:text-accent"
          }`}
        >
          {word}
        </span>
        <span className="mx-[0.2em] inline-block size-[0.16em] rotate-45 bg-accent" />
      </span>
    ));

  return (
    <div
      className="relative overflow-hidden border-y border-line py-[2vw] text-[clamp(3rem,9vw,8.5rem)] leading-[1]"
      aria-label={`Core skills: ${items.join(", ")}`}
      role="marquee"
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
