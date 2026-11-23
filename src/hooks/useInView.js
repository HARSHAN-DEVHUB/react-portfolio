import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook.
 * Returns [ref, inView, hasEntered] — `hasEntered` stays true after the first hit,
 * which is what we use to lazily mount 3D scenes.
 */
export function useInView({ rootMargin = "0px", threshold = 0 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView, hasEntered];
}

export default useInView;
