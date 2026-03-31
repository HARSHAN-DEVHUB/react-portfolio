import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import Analytics from "./components/Analytics";
import SEO from "./components/SEO";
import Performance from "./components/Performance";
import Resume from "./components/Resume";
import ErrorBoundary from "./components/ErrorBoundary";

function ParallaxSection({ children, id, depth = 36, drift = 0 }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.45,
  });

  const y = useTransform(
    smoothProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [depth, -depth]
  );

  const x = useTransform(
    smoothProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-drift, drift]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.992, 1, 0.992]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.82, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [0.84, 1, 1, 0.84]
  );
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.22, 0.12, 0.22]);

  return (
    <motion.div id={id} ref={sectionRef} className="section-shell" style={{ x, y, opacity, scale }}>
      <motion.div
        aria-hidden="true"
        className="section-glow"
          style={{ opacity: glowOpacity }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className={`app-shell scroll-smooth transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="ambient-bg" aria-hidden="true" />
        <div className="ambient-grid" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-a" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-b" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-c" aria-hidden="true" />

        <div className="relative z-10 min-h-screen">
          <SEO />
          <Analytics />
          <Performance />
          <Header />
          <main className="pt-20">
            <ParallaxSection id="hero" depth={14} drift={0}><Hero /></ParallaxSection>
            <ParallaxSection depth={32} drift={16}><About /></ParallaxSection>
            <ParallaxSection depth={30} drift={-18}><Skills /></ParallaxSection>
            <ParallaxSection depth={34} drift={22}><Projects /></ParallaxSection>
            <ParallaxSection depth={28} drift={-12}><Resume /></ParallaxSection>
            <ParallaxSection depth={22} drift={14}><Contact /></ParallaxSection>
          </main>
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
