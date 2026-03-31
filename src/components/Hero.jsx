import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import resumePDF from "../assets/HARSHAN B RESUME.pdf";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const phrases = [
  "Creative Developer",
  "Ethical Hacker",
  "UI/UX Enthusiast",
  "React Specialist",
];

const skills = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "Framer Motion",
];



const socialLinks = [
  {
    icon: <FaGithub />,
    href: "https://github.com/HARSHAN-DEVHUB",
    label: "GitHub",
  },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/harshan-harshu",
    label: "LinkedIn",
  },
  {
    icon: <FaEnvelope />,
    href: "mailto:harshan@example.com",
    label: "Email",
  },
];

export default function Hero() {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Typewriter logic with better variable names and separation
  const [displayText, setDisplayText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);
  const [isDesktopParallax, setIsDesktopParallax] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const pointerXSpring = useSpring(pointerX, {
    stiffness: 120,
    damping: 20,
    mass: 0.25,
  });

  const pointerYSpring = useSpring(pointerY, {
    stiffness: 120,
    damping: 20,
    mass: 0.25,
  });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const bgDepth = shouldReduceMotion ? 28 : 170;
  const leftDepth = shouldReduceMotion ? 14 : 90;
  const rightDepth = shouldReduceMotion ? 18 : 130;
  const orbOneDepth = shouldReduceMotion ? -18 : -130;
  const orbTwoDepth = shouldReduceMotion ? -14 : -95;

  const bgParallaxY = useTransform(smoothProgress, [0, 1], [0, bgDepth]);
  const leftParallaxY = useTransform(smoothProgress, [0, 1], [0, leftDepth]);
  const rightParallaxY = useTransform(smoothProgress, [0, 1], [0, rightDepth]);
  const orbOneY = useTransform(smoothProgress, [0, 1], [0, orbOneDepth]);
  const orbTwoY = useTransform(smoothProgress, [0, 1], [0, orbTwoDepth]);
  const fadeOut = useTransform(
    smoothProgress,
    [0, 0.85, 1],
    shouldReduceMotion ? [1, 0.95, 0.92] : [1, 0.55, 0.2]
  );

  const mouseContentX = useTransform(
    pointerXSpring,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-12, 12]
  );
  const mouseContentY = useTransform(
    pointerYSpring,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-8, 8]
  );
  const mouseMediaX = useTransform(
    pointerXSpring,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [18, -18]
  );
  const mouseMediaY = useTransform(
    pointerYSpring,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [10, -10]
  );

  const contentX = useTransform(mouseContentX, (x) => (isDesktopParallax ? x : 0));
  const contentY = useTransform(mouseContentY, (y) => (isDesktopParallax ? y : 0));
  const mediaX = useTransform(mouseMediaX, (x) => (isDesktopParallax ? x : 0));
  const mediaY = useTransform(mouseMediaY, (y) => (isDesktopParallax ? y : 0));
  const mediaRotateX = useTransform(
    pointerYSpring,
    [-1, 1],
    shouldReduceMotion || !isDesktopParallax ? [0, 0] : [5, -5]
  );
  const mediaRotateY = useTransform(
    pointerXSpring,
    [-1, 1],
    shouldReduceMotion || !isDesktopParallax ? [0, 0] : [-7, 7]
  );
  const orbDriftX = useTransform(
    pointerXSpring,
    [-1, 1],
    shouldReduceMotion || !isDesktopParallax ? [0, 0] : [-25, 25]
  );
  const orbDriftY = useTransform(
    pointerYSpring,
    [-1, 1],
    shouldReduceMotion || !isDesktopParallax ? [0, 0] : [-18, 18]
  );
  const orbOneMotionY = useTransform([orbOneY, orbDriftY], ([a, b]) => a + b);
  const orbTwoMotionX = useTransform(orbDriftX, (v) => -v);
  const orbTwoMotionY = useTransform([orbTwoY, orbDriftY], ([a, b]) => a - b);
  const mediaGlowX = useTransform(mediaX, (v) => v * 0.35);
  const mediaGlowY = useTransform(mediaY, (v) => v * 0.45);
  const contentParallaxY = useTransform([leftParallaxY, contentY], ([a, b]) => a + b);
  const mediaParallaxY = useTransform([rightParallaxY, mediaY], ([a, b]) => a + b);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (pointer: fine)");

    const updateDesktopParallax = () => {
      setIsDesktopParallax(mediaQuery.matches && !shouldReduceMotion);
    };

    updateDesktopParallax();
    mediaQuery.addEventListener("change", updateDesktopParallax);

    return () => mediaQuery.removeEventListener("change", updateDesktopParallax);
  }, [shouldReduceMotion]);

  const handlePointerMove = (event) => {
    if (!isDesktopParallax) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    pointerX.set(Math.max(-1, Math.min(1, x)));
    pointerY.set(Math.max(-1, Math.min(1, y)));
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timeout;

    if (!isDeleting && charIdx <= currentPhrase.length) {
      setDisplayText(currentPhrase.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((i) => i + 1), 80);
    } else if (isDeleting && charIdx >= 0) {
      setDisplayText(currentPhrase.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((i) => i - 1), 40);
    } else if (!isDeleting && charIdx > currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && charIdx < 0) {
      setIsDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      setCharIdx(0);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Scroll to projects
  const handleScrollToProjects = () => {
    const el = document.getElementById("projects");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4 py-16 md:py-24 overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {/* Enhanced decorative background */}
      <motion.div className="absolute inset-0 -z-20 pointer-events-none" style={{ y: bgParallaxY }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-fuchsia-800/10 to-indigo-900/30 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-indigo-900/10" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
            style={{ x: orbDriftX, y: orbOneMotionY }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"
            style={{ x: orbTwoMotionX, y: orbTwoMotionY }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.svg className="absolute bottom-0 left-0 w-full h-32 z-0" viewBox="0 0 1440 320" style={{ y: orbOneY }}>
          <path fill="#a78bfa" fillOpacity="0.14" d="M0,160L80,165.3C160,171,320,181,480,165.3C640,149,800,107,960,96C1120,85,1280,107,1360,117.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </motion.svg>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ x: contentX, y: contentParallaxY, opacity: fadeOut }}
          className="text-left flex flex-col gap-4"
        >
          <span className="inline-block bg-fuchsia-600/20 text-fuchsia-400 px-3 py-1 rounded-full text-xs font-semibold mb-1 tracking-wide uppercase w-max">
            Open to Opportunities
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Harshan
            </span>
          </h1>
          <div className="flex flex-wrap gap-2 mb-1">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 text-xs text-white px-2 py-1 rounded-full font-semibold shadow hover:scale-105 transition-transform"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="h-10 flex items-center">
            <span className="text-lg md:text-xl text-gray-300 font-mono">
              {displayText}
              <span className={`ml-1 ${isBlinking ? "opacity-100" : "opacity-0"} text-purple-400`}>
                |
              </span>
            </span>
          </div>
          <p className="text-gray-400 mb-2 max-w-xl">
            Passionate full-stack developer creating innovative web applications with modern technologies. I specialize in React, Node.js, and cloud solutions, always striving to deliver exceptional user experiences and scalable solutions.
          </p>
          <div className="mb-2 italic text-fuchsia-300 text-sm">
            "Code is like humor. When you have to explain it, it’s bad." – Cory House
          </div>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {/* {certifications.map((cert, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800/60 text-yellow-200 rounded-full text-xs font-semibold hover:bg-gray-800/80 transition-colors"
              >
                {cert.icon} {cert.name}
              </span>
            ))} */}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={handleScrollToProjects}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:scale-105 transition focus:ring-2 focus:ring-purple-400"
              aria-label="View my projects"
            >
              Hire Me
            </button>
            <a
              href={resumePDF}
              download="HARSHAN_B_RESUME.pdf"
              className="px-8 py-3 border border-purple-700 text-purple-300 rounded-lg text-sm font-semibold hover:bg-purple-700/20 transition"
              aria-label="Download my resume"
            >
              Download CV
            </a>
          </div>
          <div className="flex items-center gap-4 mb-3">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-2xl text-gray-400 hover:text-purple-400 transition"
              >
                {link.icon}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <span>📍 New York, USA</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-green-400 font-semibold">Available for Remote Work</span>
          </div>
        </motion.div>

        {/* Right: Profile Photo with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            x: mediaX,
            y: mediaParallaxY,
            rotateX: mediaRotateX,
            rotateY: mediaRotateY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          }}
          className="flex justify-center md:justify-end items-center relative"
        >
          {/* Glowing background effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-2xl scale-110"
            style={{ x: mediaGlowX, y: mediaGlowY }}
          />
          
          <div className="relative w-100 h-100 md:w-120 md:h-169 rounded-2xl overflow-hidden shadow-2xl group">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            
            <motion.img
              src="/Me.jpg"
              alt="Harshan Babu"
              className="w-full h-full object-cover object-center rounded-2xl"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-purple-700/30 to-indigo-700/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="absolute -inset-8 -z-20 bg-gradient-to-tr from-fuchsia-500/10 to-indigo-500/10 rounded-3xl blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
