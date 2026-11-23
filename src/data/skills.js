/**
 * Skill groups for the 3D skill sphere.
 * `tone` maps to a palette colour: accent | accent2 | ink | muted | dark.
 * `level` is 0–100.
 */
export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    tone: "accent",
    skills: [
      { name: "React", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 70 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Three.js", level: 70 },
      { name: "HTML / CSS", level: 88 },
      { name: "UI / UX Design", level: 80 },
    ],
  },
  {
    id: "backend",
    label: "Backend & Data",
    tone: "accent2",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "Python", level: 80 },
      { name: "FastAPI", level: 75 },
      { name: "PostgreSQL", level: 72 },
      { name: "Prisma", level: 72 },
      { name: "Firebase", level: 78 },
      { name: "SQL", level: 75 },
    ],
  },
  {
    id: "security",
    label: "Security",
    tone: "ink",
    skills: [
      { name: "Penetration Testing", level: 80 },
      { name: "Metasploit", level: 85 },
      { name: "Nmap", level: 85 },
      { name: "Wireshark", level: 78 },
      { name: "Digital Forensics", level: 75 },
      { name: "Cryptography", level: 68 },
      { name: "Steganography", level: 65 },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    tone: "muted",
    skills: [
      { name: "PyTorch", level: 65 },
      { name: "OpenCV", level: 75 },
      { name: "RAG / FAISS", level: 72 },
      { name: "scikit-learn", level: 70 },
      { name: "XGBoost", level: 68 },
      { name: "MQL5", level: 78 },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    tone: "dark",
    skills: [
      { name: "Git", level: 88 },
      { name: "Linux", level: 92 },
      { name: "Docker", level: 72 },
      { name: "Vite", level: 85 },
      { name: "Playwright", level: 65 },
      { name: "Vercel", level: 85 },
    ],
  },
];

export const allSkills = skillGroups.flatMap((g) =>
  g.skills.map((s) => ({ ...s, group: g.id, groupLabel: g.label, tone: g.tone }))
);
