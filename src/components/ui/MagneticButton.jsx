import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFinePointer, useReducedMotion } from "../../hooks/useIsMobile";

const variants = {
  solid:
    "bg-accent text-bg hover:bg-ink",
  outline:
    "border border-line-strong text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink hover:text-accent",
  round:
    "size-28 rounded-full border border-line-strong text-ink hover:border-accent hover:bg-accent hover:text-bg md:size-32",
};

/**
 * A link or button that is pulled toward the cursor inside its hit area.
 * Pass `href` to render an <a>, otherwise renders a <button>.
 */
export default function MagneticButton({
  children,
  href,
  variant = "outline",
  strength = 0.35,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const tx = useTransform(sx, (v) => v * 0.45);
  const ty = useTransform(sy, (v) => v * 0.45);

  const onMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;
  const base =
    variant === "round"
      ? "inline-flex items-center justify-center text-center"
      : "inline-flex items-center gap-3 px-6 py-4 md:px-7";

  return (
    <Tag
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`${base} font-mono text-[0.78rem] uppercase tracking-[0.12em] transition-colors duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-3">
        {children}
      </motion.span>
    </Tag>
  );
}
