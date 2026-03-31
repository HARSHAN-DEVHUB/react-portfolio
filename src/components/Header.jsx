import { useEffect, useState } from "react";
import { FaArrowRight, FaGithub, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa";

const navItems = [
  { label: "Home", to: "#hero" },
  { label: "Skills", to: "#skills" },
  { label: "Projects", to: "#projects" },
  { label: "Resume", to: "#resume" },
  { label: "About", to: "#about" },
  { label: "Contact", to: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.to))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 24);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min((current / totalHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleNavClick = (to) => {
    setMenuOpen(false);
    const el = document.querySelector(to);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const Hamburger = ({ open }) => (
    <button
      className="group flex h-9 w-9 flex-col items-center justify-center focus:outline-none"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setMenuOpen((v) => !v)}
    >
      <span
        className={`block h-0.5 w-7 rounded bg-teal-200 transition-all duration-300 ${
          open ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`my-1 block h-0.5 w-7 rounded bg-teal-200 transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-7 rounded bg-teal-200 transition-all duration-300 ${
          open ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-500 ${
        isScrolled
          ? "border-white/15 bg-slate-950/75 shadow-[0_16px_45px_rgba(5,10,22,0.45)]"
          : "border-white/5 bg-slate-950/35"
      }`}
    >
      <div
        className="header-progress"
        aria-hidden="true"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a
          href="#hero"
          className="group select-none"
          aria-label="Home"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick("#hero");
          }}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/90 via-teal-500/80 to-emerald-500/80 shadow-[0_0_35px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:scale-105">
              <FaCode className="logo-spin text-xl text-white" />
            </span>
            <span className="text-xl font-black tracking-[0.17em] text-slate-100 transition-all duration-300 group-hover:text-cyan-200">
              HARSHAN
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-3 rounded-full border border-white/10 bg-slate-900/55 p-2 md:flex">
          {navItems.map((item) => (
            <li key={item.to} className="relative">
              <button
                onClick={() => handleNavClick(item.to)}
                className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeSection === item.to
                    ? "bg-gradient-to-r from-cyan-500/85 to-emerald-500/85 text-slate-950 shadow-[0_10px_24px_rgba(20,184,166,0.35)]"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
                aria-label={item.label}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <div className="flex gap-3 text-lg">
            <a
              href="https://github.com/HARSHAN-DEVHUB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition-colors duration-300 hover:text-cyan-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/harshan-harshu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition-colors duration-300 hover:text-cyan-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
          <button
            onClick={() => handleNavClick("#contact")}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400/20"
          >
            Hire Me
            <FaArrowRight className="text-xs" />
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Hamburger open={menuOpen} />
        </div>
      </nav>

      <div
        className={`absolute left-0 top-full w-full border-b border-white/10 bg-slate-950/95 px-5 pb-5 pt-3 shadow-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <ul className="grid grid-cols-2 gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <button
                onClick={() => handleNavClick(item.to)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all duration-300 ${
                  activeSection === item.to
                    ? "bg-cyan-500/20 text-cyan-100"
                    : "bg-slate-800/60 text-slate-200 hover:bg-slate-700/70"
                }`}
                aria-label={item.label}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
          <div className="flex gap-4 text-lg">
            <a
              href="https://github.com/HARSHAN-DEVHUB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition-colors duration-300 hover:text-cyan-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/harshan-harshu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition-colors duration-300 hover:text-cyan-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:harshanharshu66@gmail.com"
              className="text-slate-300 transition-colors duration-300 hover:text-cyan-200"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              handleNavClick("#contact");
            }}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-950"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
