/**
 * Featured projects appear in the horizontal gallery, in this order.
 * Every description follows Problem → What I built → Result.
 *
 * `image`  cover / screenshot in /public. The current covers were pre-rendered from `cover`
 *          (dev route /?capture=covers). Remove `image` to generate one at runtime instead.
 * `impact` the one metric shown in the accent colour on the card.
 */
export const projects = [
  {
    slug: "stylehub",
    image: "images/projects/stylehub.webp",
    name: "StyleHub Commerce",
    oneLiner: "A production-grade commerce platform — catalogue to checkout to admin console.",
    impact: "Admin console · RBAC · CI-tested",
    problem:
      "Most portfolio stores stop at a product grid and a fake cart. Real shops need auth that can't be bypassed, admins who can run the business, and a database that survives schema changes.",
    built:
      "A React + Express platform on PostgreSQL. JWT access tokens with refresh-cookie rotation, admin/user role guards, Zod-validated APIs, rate-limited auth, and structured logs with correlation IDs. Admins get a console for KPIs, products (bulk stock and category edits), orders and categories.",
    result:
      "End-to-end flow from catalogue to persisted orders, shipped with Prisma migrations, Docker Compose, and a CI pipeline running Vitest, Supertest and Playwright.",
    stack: ["React", "Express", "PostgreSQL", "Prisma", "Docker", "Playwright"],
    role: "Solo — design, backend, frontend, tests",
    year: "2026",
    live: "https://e-commerse-ruddy.vercel.app",
    repo: "https://github.com/HARSHAN-DEVHUB/e-commerse",
    cover: { glyph: "SH", tone: "accent" },
  },
  {
    slug: "offline-chatbot",
    image: "images/projects/offline-chatbot.webp",
    name: "Offline RAG Chatbot",
    oneLiner: "A university-support chatbot that cites its sources and refuses to guess.",
    impact: "0 cloud AI APIs · cited answers",
    problem:
      "Chatbots give generic answers, hallucinate facts, and forget context — and most fixes depend on paid cloud APIs that leak user data.",
    built:
      "An offline assistant for my MSc dissertation: retrieval over SQLite + FAISS memory, answers with citations, refusal when evidence is missing, continuous memory ingestion from chats, and a weekly LoRA fine-tune gated by promotion checks.",
    result:
      "Runs fully local with no hosted AI. Evaluation scripts measure baseline vs improved specificity, refusal quality and citation use.",
    stack: ["Python", "FAISS", "SQLite", "LoRA", "RAG"],
    role: "Researcher & engineer — MSc dissertation",
    year: "2026",
    live: null,
    repo: "https://github.com/HARSHAN-DEVHUB/Limitation-of-ChatBot",
    cover: { glyph: "RAG", tone: "ink" },
  },
  {
    slug: "anpr",
    image: "images/projects/anpr.webp",
    name: "ANPR Vehicle Check",
    oneLiner: "Computer vision that flags unregistered number plates automatically.",
    impact: "95% plate-detection accuracy",
    problem:
      "Spotting unregistered vehicles by eye is slow and inconsistent — plates get missed in traffic, at night, and at odd angles.",
    built:
      "A Python + OpenCV pipeline that detects plates in camera frames, reads them with OCR, and checks each one against a vehicle-registration database.",
    result: "95% accuracy on licence-plate detection and OCR, with unregistered plates flagged the moment they're read.",
    stack: ["Python", "OpenCV", "OCR", "Machine Learning", "SQL"],
    role: "Solo — model, pipeline, database",
    year: "2024",
    live: null,
    repo: null,
    cover: { glyph: "ANPR", tone: "accent2" },
  },
  {
    slug: "buddy-ai",
    image: "images/projects/buddy-ai.webp",
    name: "Buddy AI",
    oneLiner: "Market-prediction platform for forex, crypto and Indian equities.",
    impact: "3 markets · 4 model families",
    problem:
      "Retail traders get either expensive signal subscriptions or single-indicator scripts that ignore sentiment and order flow.",
    built:
      "A FastAPI + PyTorch backend with TFT, LSTM/GRU, ensemble and Prophet models, fed by live MT5 and Binance prices plus NSE data, behind a React + TypeScript dashboard.",
    result:
      "One free platform covering XAUUSD, EURUSD, BTC, ETH and NIFTY 50 — technical indicators, backtesting data and predictions side by side.",
    stack: ["Python", "FastAPI", "PyTorch", "React", "TypeScript", "MT5"],
    role: "Solo — models, API, dashboard",
    year: "2025",
    live: null,
    repo: "https://github.com/HARSHAN-DEVHUB/Buddy-AI",
    cover: { glyph: "AI", tone: "ink" },
  },
  {
    slug: "harshan-cabs",
    image: "images/projects/harshan-cabs.webp",
    name: "Harshan Cabs",
    oneLiner: "Booking site for a South Indian taxi and tour operator.",
    impact: "Bookings straight to WhatsApp",
    problem:
      "A taxi business that took every booking by phone needed customers to be able to compare cabs and tour packages online.",
    built:
      "A React single-page site with tour packages for Karnataka, Kerala and Tamil Nadu, visual cab selection with pricing, a booking form with real-time validation, and one-tap WhatsApp contact.",
    result: "Customers compare cabs, see the price and book from any phone — no call needed.",
    stack: ["React", "Vite", "React Router", "CSS"],
    role: "Freelance — design & build",
    year: "2025",
    live: "https://harshan-cabs-plum.vercel.app",
    repo: "https://github.com/HARSHAN-DEVHUB/harshan-cabs",
    cover: { glyph: "CAB", tone: "ink" },
  },
  {
    slug: "pentest-suite",
    image: "images/projects/pentest-suite.webp",
    name: "Recon & Pentest Suite",
    oneLiner: "USB-triggered reconnaissance toolkit for authorised security audits.",
    impact: "Full host profile on insert",
    problem:
      "On an authorised audit, manually collecting network config, installed software and drive data from every machine wastes the engagement window.",
    built:
      "A Python toolkit that profiles a host the moment the USB is inserted — network configuration, installed software, storage and user data — combined with network vulnerability scanning for the wider estate.",
    result: "Host recon runs unattended, so the engagement window goes on actual testing.",
    stack: ["Python", "Nmap", "Windows internals", "Networking"],
    role: "Solo — security research",
    year: "2025",
    live: null,
    repo: "https://github.com/HARSHAN-DEVHUB/sys-info-geathering",
    cover: { glyph: "USB", tone: "accent2" },
  },
];

/** Smaller builds listed under the gallery. */
export const moreProjects = [
  {
    name: "Advance Stock",
    note: "FastAPI + XGBoost service predicting stock opening prices, with a React front end.",
    stack: "Python · FastAPI · XGBoost",
    href: "https://github.com/HARSHAN-DEVHUB/advance-stock",
  },
  {
    name: "Namakari Kadai",
    note: "Conversion-focused restaurant site for authentic Indian cuisine.",
    stack: "React",
    href: "https://namakarikadai.vercel.app",
  },
  {
    name: "MT5 Expert Advisors",
    note: "MetaTrader 5 bots with multi-signal confirmation, running unattended on a VPS.",
    stack: "MQL5 · MetaTrader 5",
    href: null,
  },
  {
    name: "Android Security Lab",
    note: "Android vulnerability assessment with Metasploit and ADB in a controlled lab.",
    stack: "Metasploit · ADB",
    href: null,
  },
];
