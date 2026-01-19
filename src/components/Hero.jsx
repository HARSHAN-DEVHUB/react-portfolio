import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaAward } from "react-icons/fa";

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

const certifications = [
  { name: "Google Cybersecurity", icon: <FaAward className="text-yellow-400" /> },
  { name: "AWS Certified", icon: <FaAward className="text-yellow-400" /> },
  { name: "UI/UX Nanodegree", icon: <FaAward className="text-yellow-400" /> },
];

const socialLinks = [
  {
    icon: <FaGithub />,
    href: "https://github.com/HARSHAN-DEVHUB",
    label: "GitHub",
  },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/harshan",
    label: "LinkedIn",
  },
  {
    icon: <FaEnvelope />,
    href: "mailto:harshan@example.com",
    label: "Email",
  },
];

export default function Hero() {
  // Typewriter logic with better variable names and separation
  const [displayText, setDisplayText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

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
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4 py-16 md:py-24 overflow-hidden">
      {/* Enhanced decorative background */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-fuchsia-800/10 to-indigo-900/30 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-indigo-900/10" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
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
        
        <svg className="absolute bottom-0 left-0 w-full h-32 z-0" viewBox="0 0 1440 320">
          <path fill="#a78bfa" fillOpacity="0.14" d="M0,160L80,165.3C160,171,320,181,480,165.3C640,149,800,107,960,96C1120,85,1280,107,1360,117.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
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
            {certifications.map((cert, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800/60 text-yellow-200 rounded-full text-xs font-semibold hover:bg-gray-800/80 transition-colors"
              >
                {cert.icon} {cert.name}
              </span>
            ))}
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
              href="/resume.pdf"
              download
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
          className="flex justify-center md:justify-end items-center relative"
        >
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl blur-2xl scale-110" />
          
          <div className="relative w-100 h-100 md:w-120 md:h-169 rounded-2xl overflow-hidden shadow-2xl group">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            
            <motion.img
              src="/Me.jpg"
              alt="John Doe"
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
