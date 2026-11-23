import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../data/profile";
import { scrollTo, startScroll, stopScroll } from "../../hooks/useLenis";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/** Fixed top bar. Hides on scroll down, returns on scroll up. Full-screen menu on mobile. */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) stopScroll();
    else if (wasOpen.current) startScroll();
    wasOpen.current = open;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(`#${id}`, { offset: id === "work" ? 0 : -24 });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-transform duration-700 ease-[var(--ease-out)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav aria-label="Primary" className="shell flex items-center justify-between py-5 mix-blend-difference text-[#EDEDE6]">
          <a href="#top" onClick={go("top")} className="font-mono text-sm tracking-[0.1em]">
            {profile.initials}
            <span className="ml-2 opacity-50">©{String(new Date().getFullYear()).slice(2)}</span>
            <span className="sr-only"> — {profile.name}, back to top</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l, i) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className="label link-wipe !text-[#EDEDE6] pb-0.5">
                  <span className="opacity-50">0{i + 1}</span> {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="label !text-[#EDEDE6] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col justify-end bg-bg pb-10 md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="shell">
              {links.map((l, i) => (
                <li key={l.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="flex items-baseline justify-between py-3 font-display text-5xl font-medium tracking-[-0.03em]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {l.label}
                    <span className="label">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
