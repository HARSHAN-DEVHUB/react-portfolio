import { FaArrowUp, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const quickLinks = [
  { label: "Home", to: "#hero" },
  { label: "Skills", to: "#skills" },
  { label: "Projects", to: "#projects" },
  { label: "About", to: "#about" },
  { label: "Contact", to: "#contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    const target = document.querySelector(id);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 px-4 py-12 text-slate-300 backdrop-blur-lg">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-black tracking-[0.2em] text-cyan-100">HARSHAN</h3>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
            Developer focused on high-performance interfaces, secure engineering, and brand-first product experiences.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Quick Links</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <button
                  onClick={() => scrollTo(link.to)}
                  className="text-slate-400 transition-colors duration-300 hover:text-cyan-200"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-end">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Connect</h4>
          <div className="mt-4 flex items-center gap-3 text-lg">
            <a
              href="https://github.com/HARSHAN-DEVHUB"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition-all duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/harshan-harshu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition-all duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:harshanharshu66@gmail.com"
              aria-label="Email"
              className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition-all duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
            >
              <FaEnvelope />
            </a>
          </div>
          <button
            onClick={() => scrollTo("#hero")}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            Back to top
            <FaArrowUp />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
        <p>© {year} Harshan. All rights reserved.</p>
        <p>Built with React, Motion, and a strong obsession for details.</p>
      </div>
    </footer>
  );
};

export default Footer;
