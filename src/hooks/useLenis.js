import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** Scroll state shared with the 3D scenes and the marquee. */
export const scrollState = { y: 0, velocity: 0, direction: 1 };

let lenis = null;
export const getLenis = () => lenis;

/** Smooth-scrolls to a selector / element / number. Falls back to native scrolling. */
export function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...options });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView();
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * always agree on the scroll position. Disabled when `enabled` is false
 * (prefers-reduced-motion).
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    let lastY = window.scrollY;
    const onNativeScroll = () => {
      const y = window.scrollY;
      scrollState.velocity = y - lastY;
      scrollState.direction = y >= lastY ? 1 : -1;
      scrollState.y = y;
      lastY = y;
    };

    if (!enabled) {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      autoRaf: false,
    });

    lenis.on("scroll", (instance) => {
      scrollState.y = instance.scroll;
      scrollState.velocity = instance.velocity;
      scrollState.direction = instance.direction || 1;
      ScrollTrigger.update();
    });

    const tick = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

export default useLenis;
