import { createContext, useContext } from "react";

export const QualityContext = createContext("high");

/** "high" | "low" — drops to "low" when PerformanceMonitor sees sustained low FPS. */
export const useQuality = () => useContext(QualityContext);
