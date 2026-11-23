/** Resolves a path inside /public against Vite's base (works on GitHub Pages too). */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

let webglCache;
export function hasWebGL() {
  if (webglCache !== undefined) return webglCache;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("no3d")) return (webglCache = false);
    const canvas = document.createElement("canvas");
    webglCache = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** Rough low-end check: very little memory or very few cores. */
export function isLowEndDevice() {
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  return (memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/** Should we render the WebGL scenes at all? */
export const canRender3D = () => hasWebGL() && !isLowEndDevice();
