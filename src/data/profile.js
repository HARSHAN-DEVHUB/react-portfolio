/**
 * Everything about you lives here. Components only read from this file,
 * so you can rewrite copy without touching any JSX.
 */

export const profile = {
  name: "Harshan Babu",
  shortName: "Harshan",
  initials: "HB",
  title: "Full-Stack Developer & Security Analyst",
  location: "Portsmouth, United Kingdom",
  timezone: "Europe/London",
  availability: "Available for work — 2026",
  siteUrl: "https://harshanoff.vercel.app",

  // Hero: each string is one huge line. Keep it to 2–5 words in total.
  headline: ["I build it.", "Then I", "break it."],
  // The one line of proof under the headline.
  proof:
    "Full-stack developer with a cyber-crime unit background. I ship React, Node and Python products — then attack them myself before anyone else can.",

  // About: short punchy paragraphs, highlighted word-by-word on scroll.
  bio: [
    "I started on live cases at the Coimbatore cyber crime cell. That job showed me exactly how software breaks in the real world.",
    "Now I build the other side. Commerce platforms with role-based access, Python computer vision, offline AI chatbots, and MetaTrader 5 bots that trade gold on their own.",
    "Every build gets attacked before it ships. I run the scans, the exploits and the forensics myself.",
  ],
  currentFocus:
    "MSc Information Systems at the University of Portsmouth — building an offline, citation-grounded AI chatbot for my dissertation.",

  // About: animated counters. `value` is the number the counter runs to.
  stats: [
    { value: 14, suffix: "", label: "Projects built" },
    { value: "skills", suffix: "+", label: "Technologies" }, // "skills" = counted from skills.js
    { value: 5, suffix: "", label: "Years coding" },
    { value: 9, suffix: "", label: "Security certifications" },
  ],

  contact: {
    email: "harshanharshu66@gmail.com",
    formspreeId: "xjkbwozn", // https://formspree.io — form submissions go to your inbox
    resume: "resume.pdf", // lives in /public
  },

  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/HARSHAN-DEVHUB" },
    { label: "LinkedIn", short: "IN", href: "https://www.linkedin.com/in/harshan-harshu" },
    { label: "Email", short: "@", href: "mailto:harshanharshu66@gmail.com" },
  ],

  // 3D avatar: a friendly low-poly robot (CC0 "RobotExpressive" by Tomás Laulhé).
  // To swap in another rigged .glb, update the clip / bone names below.
  avatar: {
    url: "models/avatar.glb", // relative to /public
    height: 2.1, // the model is auto-scaled to this height in world units
    headBone: "Head", // bone that follows the mouse (Mixamo rigs: "mixamorigHead")
    clips: {
      wave: "Wave",
      idle: "Idle",
      typing: "Sitting",
      point: "ThumbsUp",
    },
    // Clips that play once and freeze on their last frame ("Sitting" is a sit-down move).
    holdClips: ["typing"],
    // Recolours the robot's materials into the palette's clay tones.
    recolor: { Main: "clay", Grey: "muted", Black: "dark" },
    // Shown when WebGL is unavailable or the device is low-end.
    fallbackImage: "images/avatar-fallback.png",
  },

  // Words for the infinite marquee under the hero.
  marquee: ["React", "Node.js", "Python", "Penetration Testing", "Three.js", "PostgreSQL", "FastAPI", "Digital Forensics", "MQL5"],
};

export const achievements = [
  {
    title: "Ethical Hacking Essentials",
    issuer: "EC-Council · CodeRed",
    code: "EHE",
    proves: "Attack phases, web and network threats, and the tooling behind a real penetration test.",
  },
  {
    title: "Network Defense Essentials",
    issuer: "EC-Council",
    code: "NDE",
    proves: "Network security controls, firewalls, IDS/IPS, and defending infrastructure under attack.",
  },
  {
    title: "OCI 2023 Foundations Associate",
    issuer: "Oracle",
    code: "OCI",
    proves: "Cloud architecture, identity and access, and security on Oracle Cloud Infrastructure.",
  },
  {
    title: "CSI Linux Certified Investigator",
    issuer: "CSI Linux",
    code: "CSIL-CI",
    proves: "Digital forensics and OSINT investigations run end-to-end on Linux.",
  },
  {
    title: "General Linux Administration",
    issuer: "CSI Linux",
    code: "LNX",
    proves: "Users, permissions, services and hardening on production Linux systems.",
  },
  {
    title: "Critical Infrastructure Protection",
    issuer: "OPSWAT",
    code: "CIP",
    proves: "Securing OT and industrial networks — the systems that keep power and water running.",
  },
  {
    title: "Dark Web, Anonymity & Cryptocurrency",
    issuer: "EC-Council · CodeRed",
    code: "DW",
    proves: "How Tor, anonymity networks and crypto payments work — and how investigators trace them.",
  },
  {
    title: "Ethical Hacking",
    issuer: "Certificate",
    code: "EH",
    proves: "Reconnaissance, exploitation with Metasploit, and reporting findings responsibly.",
  },
  {
    title: "International Cyber Threat Force",
    issuer: "ICTF",
    code: "ICTF",
    proves: "Threat intelligence and incident response with an international security community.",
  },
];
