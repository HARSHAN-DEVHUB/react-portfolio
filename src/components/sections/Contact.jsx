import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../data/profile";
import { useSite } from "../../context/SiteContext";
import { useInView } from "../../hooks/useInView";
import { asset } from "../../lib/device";
import SectionHeader from "../ui/SectionHeader";
import RevealText from "../ui/RevealText";
import MagneticButton from "../ui/MagneticButton";
import AvatarFallback from "../ui/AvatarFallback";

const ContactScene = lazy(() => import("../canvas/ContactScene"));

const EMPTY = { name: "", email: "", message: "" };

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Tell me who you are.";
  if (!f.email.trim()) e.email = "I need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "That email doesn't look right.";
  if (f.message.trim().length < 10) e.message = "A sentence or two, at least.";
  return e;
}

function Field({ id, label, error, textarea, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="group relative">
      <label htmlFor={id} className="label flex justify-between">
        <span>{label}</span>
        <AnimatePresence>
          {error && (
            <motion.span
              id={`${id}-error`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="normal-case tracking-normal !text-accent-2"
              role="alert"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </label>
      <Tag
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 w-full resize-none border-0 border-b bg-transparent pb-3 pt-1 font-display text-2xl font-medium tracking-[-0.01em] text-ink outline-none transition-colors duration-300 placeholder:text-muted/50 focus:border-accent md:text-3xl ${
          error ? "border-accent-2" : "border-line-strong"
        }`}
        rows={textarea ? 4 : undefined}
        {...props}
      />
    </div>
  );
}

export default function Contact() {
  const { webgl, reduced } = useSite();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [sceneRef, inView] = useInView({ threshold: 0.35 });
  const [visits, setVisits] = useState(0);

  // Each time the section comes into view, the avatar waves again.
  useEffect(() => {
    if (inView) setVisits((v) => v + 1);
  }, [inView]);

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (errors[e.target.name]) setErrors(validate(next));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${profile.contact.formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _replyto: form.email, _subject: `Portfolio message from ${form.name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-16 pt-24 md:pt-36">
      <div className="shell">
        <SectionHeader index={6} label="Contact" aside={profile.availability} />
        <RevealText as="h2" id="contact-title" className="display-xxl mt-10 md:mt-16">
          Let's build
          <br />
          <span className="text-outline">something.</span>
        </RevealText>
      </div>

      <div className="shell mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        {/* Form */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[26rem] flex-col justify-center border-t border-line pt-8"
                role="status"
              >
                <svg viewBox="0 0 52 52" className="size-16 text-accent" aria-hidden="true">
                  <motion.path
                    d="M10 27 L22 38 L42 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
                  />
                </svg>
                <p className="display-md mt-6">Message received.</p>
                <p className="mt-3 max-w-sm text-muted">Thanks — I'll reply to the email you gave me.</p>
                <button onClick={() => setStatus("idle")} className="label link-wipe mt-8 w-max !text-ink">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-10" exit={{ opacity: 0, y: -20 }}>
                <Field id="name" label="01 — Your name" placeholder="Jane Doe" value={form.name} onChange={onChange} error={errors.name} autoComplete="name" />
                <Field id="email" label="02 — Email" type="email" placeholder="jane@company.com" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
                <Field id="message" label="03 — What are we building?" textarea placeholder="A short brief, a role, a timeline…" value={form.message} onChange={onChange} error={errors.message} />

                <div className="flex flex-wrap items-center gap-6">
                  <MagneticButton variant="solid" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">→</span>
                  </MagneticButton>
                  {status === "error" && (
                    <p className="text-sm text-accent-2" role="alert">
                      That didn't go through. Email me directly at{" "}
                      <a className="underline" href={`mailto:${profile.contact.email}`}>
                        {profile.contact.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar + links */}
        <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          <div ref={sceneRef} className="relative h-[46svh] min-h-80 border border-line bg-surface/40">
            {webgl ? (
              <Suspense fallback={null}>
                <ContactScene className="absolute inset-0" visits={visits} reduced={reduced} fallback={<AvatarFallback pose="contact" />} />
              </Suspense>
            ) : (
              <AvatarFallback pose="contact" />
            )}
            <span className="label absolute left-4 top-4">Fig. 03</span>
            <span className="label absolute bottom-4 left-4">← Say hi</span>
          </div>

          <div>
            <p className="label">Direct</p>
            <a href={`mailto:${profile.contact.email}`} className="link-wipe mt-3 inline-block font-display text-[clamp(1.3rem,2.2vw,2rem)] font-medium tracking-[-0.02em]">
              {profile.contact.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile.socials
              .filter((s) => s.label !== "Email")
              .map((s) => (
                <MagneticButton key={s.label} variant="round" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </MagneticButton>
              ))}
            <MagneticButton variant="round" href={asset(profile.contact.resume)} download="Harshan-Babu-Resume.pdf">
              Résumé ↓
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
