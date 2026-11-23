import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useIsMobile";

/**
 * Masked line-by-line reveal (each line slides up from behind a clip mask).
 *
 *  play      – when provided, the reveal waits for this to be true (used by the hero).
 *              Otherwise it plays when scrolled into view.
 *  as        – element to render (h1, h2, p …)
 *  delay     – seconds
 */
export default function RevealText({ as: Tag = "div", children, className = "", play, delay = 0, stagger = 0.09, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const controlled = play !== undefined;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (controlled && !play) {
      el.style.visibility = "hidden";
      return;
    }

    let split;
    let tween;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      el.style.visibility = "";
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: false,
      });
      split.masks?.forEach((m) => m.classList.add("split-line-mask"));
      tween = gsap.from(split.lines, {
        yPercent: 115,
        rotate: 2,
        duration: 1.25,
        stagger,
        delay,
        ease: "expo.out",
        scrollTrigger: controlled ? undefined : { trigger: el, start: "top 88%", once: true },
        onComplete: () => {
          // Leave clean DOM behind so text reflows on resize.
          split?.revert();
          split = null;
        },
      });
    };

    el.style.visibility = "hidden";
    document.fonts.ready.then(run);

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
      el.style.visibility = "";
    };
  }, [play, controlled, reduced, delay, stagger]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
