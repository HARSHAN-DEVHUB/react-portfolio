import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "../../hooks/useIsMobile";

/**
 * Small dot + lagging ring.
 *  - grows over links and buttons
 *  - shows a label over anything with data-cursor="view" (label from data-cursor-label)
 * Only mounted on devices with a fine pointer.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mode, setMode] = useState("default"); // default | link | view | hidden
  const [label, setLabel] = useState("View");

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf;
    let visible = false;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.x = pos.x;
        ring.y = pos.y;
        dotRef.current?.style.setProperty("opacity", "1");
        ringRef.current?.style.setProperty("opacity", "1");
      }
    };

    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, [role='button'], label, input, textarea");
      if (!target) return setMode("default");
      const type = target.getAttribute("data-cursor");
      if (type === "view") {
        setLabel(target.getAttribute("data-cursor-label") || "View");
        return setMode("view");
      }
      if (type === "drag") {
        setLabel("Drag");
        return setMode("view");
      }
      if (target.matches("input, textarea")) return setMode("default");
      setMode("link");
    };

    const onLeaveWindow = () => {
      visible = false;
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    };

    const loop = () => {
      const k = reduced ? 1 : 0.16;
      ring.x += (pos.x - ring.x) * k;
      ring.y += (pos.y - ring.y) * k;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [fine, reduced]);

  if (!fine) return null;

  const ringSize = mode === "view" ? 92 : mode === "link" ? 56 : 34;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      >
        <div
          className="-ml-[3px] -mt-[3px] size-[6px] rounded-full bg-accent transition-transform duration-300"
          style={{ transform: mode === "view" ? "scale(0)" : "scale(1)" }}
        />
      </div>
      <div
        ref={ringRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      >
        <div
          className="flex items-center justify-center rounded-full border font-mono text-[0.68rem] uppercase tracking-[0.14em]"
          style={{
            width: ringSize,
            height: ringSize,
            marginLeft: -ringSize / 2,
            marginTop: -ringSize / 2,
            borderColor: mode === "view" ? "var(--accent)" : "var(--line-strong)",
            background: mode === "view" ? "var(--accent)" : "transparent",
            color: "var(--bg)",
            transition:
              "width .45s var(--ease-out), height .45s var(--ease-out), margin .45s var(--ease-out), background .3s, border-color .3s",
          }}
        >
          <span
            className="transition-opacity duration-200"
            style={{ opacity: mode === "view" ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
