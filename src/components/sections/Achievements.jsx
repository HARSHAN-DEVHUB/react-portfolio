import { useState } from "react";
import { achievements } from "../../data/profile";
import SectionHeader from "../ui/SectionHeader";
import RevealText from "../ui/RevealText";

function FlipCard({ item, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li className="flip h-[22rem] md:h-[24rem]" data-flipped={flipped}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="flip-inner block h-full w-full text-left"
      >
        {/* Front */}
        <span className="flip-face flex flex-col justify-between border border-line bg-surface p-6">
          <span className="flex justify-between">
            <span className="label">{String(index + 1).padStart(2, "0")}</span>
            <span className="label">{item.issuer}</span>
          </span>
          <span
            className="text-outline font-display font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: item.code.length > 4 ? "clamp(3rem,5vw,4.5rem)" : "clamp(4.5rem,8vw,7rem)" }}
          >
            {item.code}
          </span>
          <span className="font-display text-xl font-medium leading-tight tracking-[-0.01em]">{item.title}</span>
        </span>

        {/* Back */}
        <span className="flip-face flip-back flex flex-col justify-between border border-accent bg-bg p-6">
          <span className="label !text-accent">What it proves</span>
          <span className="font-display text-2xl font-medium leading-tight tracking-[-0.02em]">{item.proves}</span>
          <span className="label">{item.issuer}</span>
        </span>
      </button>
    </li>
  );
}

export default function Achievements() {
  return (
    <section id="certifications" aria-labelledby="cert-title" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader index={5} label="Certifications" aside={`${achievements.length} earned`} />
        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-12">
          <RevealText as="h2" id="cert-title" className="display-xl lg:col-span-7">
            Proof,
            <br />
            <span className="text-outline">on paper.</span>
          </RevealText>
          <p className="self-end text-muted lg:col-span-4 lg:col-start-9">
            Security and cloud certifications from EC-Council, Oracle, OPSWAT and CSI Linux. Hover or tap a card to see what each one actually covers.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <FlipCard key={a.title} item={a} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
