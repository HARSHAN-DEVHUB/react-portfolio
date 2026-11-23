import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./styles/globals.css";
import { applyTheme } from "./config/theme";
import App from "./App.jsx";

applyTheme();

// Dev-only image capture routes (?capture=avatar | og | covers). Stripped from production builds.
const captureMode = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("capture") : null;
const Capture = import.meta.env.DEV ? lazy(() => import("./components/Capture.jsx")) : null;
if (captureMode) document.getElementById("boot")?.remove();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {captureMode && Capture ? (
      <Suspense fallback={null}>
        <Capture mode={captureMode} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);
