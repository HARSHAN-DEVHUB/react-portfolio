import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteContext } from "./context/SiteContext";
import { useLenis, startScroll, stopScroll } from "./hooks/useLenis";
import { useFinePointer, useIsDesktop, useReducedMotion } from "./hooks/useIsMobile";
import { canRender3D } from "./lib/device";
import { profile } from "./data/profile";

import Loader from "./components/ui/Loader";
import Grain from "./components/ui/Grain";
import Cursor from "./components/ui/Cursor";
import Nav from "./components/ui/Nav";
import Marquee from "./components/ui/Marquee";
import ProjectDistortion from "./components/canvas/ProjectDistortion";

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Achievements from "./components/sections/Achievements";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

export default function App() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const fine = useFinePointer();
  const [webgl] = useState(() => canRender3D());
  const [introDone, setIntroDone] = useState(false);

  useLenis(!reduced);

  // Always start at the top; lock scrolling behind the loader.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (!introDone) {
      stopScroll();
      html.style.overflow = "hidden";
      return;
    }
    html.style.overflow = "";
    startScroll();
  }, [introDone]);

  const finishIntro = useCallback(() => setIntroDone(true), []);
  const ctx = useMemo(() => ({ introDone, webgl, reduced }), [introDone, webgl, reduced]);

  return (
    <SiteContext.Provider value={ctx}>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[130] -translate-y-24 bg-accent px-4 py-3 !text-bg focus:translate-y-0"
      >
        Skip to content
      </a>

      {!introDone && <Loader wait3D={webgl} reduced={reduced} onDone={finishIntro} />}
      <Grain />
      <Cursor />
      <Nav />

      <main id="main" className="relative overflow-x-clip">
        <Hero />
        <Marquee items={profile.marquee} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />

      {introDone && webgl && isDesktop && fine && !reduced && <ProjectDistortion />}
    </SiteContext.Provider>
  );
}
