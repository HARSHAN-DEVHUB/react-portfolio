import { useEffect } from "react";

/**
 * One shared, mutable mouse store. Reading it inside useFrame / rAF loops
 * costs nothing and never triggers React re-renders.
 *   x, y   → normalised -1..1 (y up)
 *   px, py → pixels
 */
export const mouse = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0 };

let listeners = 0;
let lastX = 0;
let lastY = 0;

function onMove(e) {
  mouse.px = e.clientX;
  mouse.py = e.clientY;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  mouse.vx = e.clientX - lastX;
  mouse.vy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
}

export function useMousePosition() {
  useEffect(() => {
    if (listeners++ === 0) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (--listeners === 0) window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return mouse;
}

export default useMousePosition;
