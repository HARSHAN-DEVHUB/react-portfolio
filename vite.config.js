import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site from /<repo-name>/, Vercel serves it from /.
// `npm run build:pages` sets GITHUB_PAGES=true.
const base = process.env.GITHUB_PAGES === "true" ? "/react-portfolio/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
          fx: ["@react-three/postprocessing", "postprocessing"],
          motion: ["gsap", "lenis", "framer-motion"],
        },
      },
    },
  },
});
