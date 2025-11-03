import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa";

const navItems = [
  { label: "Home", to: "#hero" },
  { label: "Projects", to: "#projects" },
  { label: "About", to: "#about" },
  { label: "Contact", to: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleNavClick = (to) => {
    setMenuOpen(false);
    const el = document.querySelector(to);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Hamburger lines
  const Hamburger = ({ open }) => (
    <button
      className="group flex flex-col justify-center items-center w-9 h-9 focus:outline-none"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setMenuOpen((v) => !v)}
    >
      <span
        className={`block h-0.5 w-7 bg-purple-400 rounded transition-all duration-300 ${
          open ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-7 bg-purple-400 rounded my-1 transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-7 bg-purple-400 rounded transition-all duration-300 ${
          open ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 border-b border-purple-900/30 shadow-lg backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group select-none"
          aria-label="Home"
        >
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <FaCode className="text-white text-2xl animate-spin-slow group-hover:animate-none" />
            <span className="absolute w-16 h-16 bg-purple-400/10 rounded-full blur-2xl -z-10" />
          </span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent tracking-wide group-hover:tracking-widest transition-all duration-300">
            Harshan
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-base font-semibold">
          {navItems.map((item, i) => (
            <li key={i} className="relative group">
              <button
                onClick={() => handleNavClick(item.to)}
                className="text-white px-2 py-1 transition-colors duration-200 relative overflow-hidden"
                aria-label={item.label}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 transition-all duration-300 z-0"></span>
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/HARSHAN-DEVHUB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/harshan-harshu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <Hamburger open={menuOpen} />
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute left-0 top-full w-full bg-black/95 border-b border-purple-900/30 shadow-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        style={{ backdropFilter: "blur(8px)" }}
      >
        <ul className="flex flex-col gap-1 py-6 px-6">
          {navItems.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavClick(item.to)}
                className="w-full text-left text-lg font-semibold text-gray-200 hover:text-purple-400 transition-colors duration-200 py-2"
                aria-label={item.label}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-6 justify-center py-4 border-t border-purple-900/30">
          <a
            href="https://github.com/HARSHAN-DEVHUB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-gray-400 hover:text-purple-400 transition-colors duration-200"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/harshan-harshu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-gray-400 hover:text-purple-400 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:harshanharshu66@gmail.com"
            className="text-xl text-gray-400 hover:text-purple-400 transition-colors duration-200"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 3.5s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
