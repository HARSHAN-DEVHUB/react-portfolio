/* ------------------------------------------------------------------ */
/* Tiny store: project cards tell the overlay which preview is hovered. */
/* ------------------------------------------------------------------ */
export const distortionState = { el: null, url: null, getQuad: null, active: false, listeners: new Set() };

export const distortionStore = {
  /** getQuad() → 4 client-space corners [tl, tr, br, bl] of the (possibly tilted) preview. */
  enter(el, url, getQuad = null) {
    if (distortionState.el && distortionState.el !== el) distortionState.el.style.opacity = "";
    distortionState.el = el;
    distortionState.url = url;
    distortionState.getQuad = getQuad;
    distortionState.active = true;
    distortionState.listeners.forEach((fn) => fn());
  },
  leave(el) {
    if (distortionState.el === el) distortionState.active = false;
    distortionState.listeners.forEach((fn) => fn());
  },
  subscribe(fn) {
    distortionState.listeners.add(fn);
    return () => distortionState.listeners.delete(fn);
  },
};
