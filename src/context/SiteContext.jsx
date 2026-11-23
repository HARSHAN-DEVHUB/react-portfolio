import { createContext, useContext } from "react";

/**
 * introDone  – the loader curtain has lifted; hero animations may start.
 * webgl      – 3D scenes are allowed on this device.
 * reduced    – prefers-reduced-motion.
 */
export const SiteContext = createContext({ introDone: false, webgl: true, reduced: false });

export const useSite = () => useContext(SiteContext);
