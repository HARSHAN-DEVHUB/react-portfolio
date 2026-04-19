import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaGlobe,
  FaCode,
  FaDatabase,
} from "react-icons/fa";

const GITHUB_USERNAME = "HARSHAN-DEVHUB";

const fallbackProjects = [
  {
    title: "Advance Stock",
    description: "A stock management and analysis tool. Currently researching improvements.",
    tags: ["Stock", "Management", "Research"],
    github: "https://github.com/HARSHAN-DEVHUB/advance-stock",
    live: null,
    details: "Researching to improve stock management and analysis features.",
    icon: <FaDatabase className="text-blue-400" />,
    category: "Research"
  },
  {
    title: "ADVANCE-EA",
    description: "Automated trading project focused on strategy execution and market automation.",
    tags: ["Python", "Trading", "Automation"],
    github: "https://github.com/HARSHAN-DEVHUB/ADVANCE-EA",
    live: null,
    details: "Python-based automated trading repository for building and testing EA workflows.",
    icon: <FaCode className="text-purple-400" />,
    category: "In Progress"
  },
  {
    title: "Harshan Cabs",
    description: "A completed cab booking and management system.",
    tags: ["Cab", "Booking", "Completed"],
    github: "https://github.com/HARSHAN-DEVHUB/harshan-cabs",
    live: null,
    details: "Cab booking and management system. Project completed.",
    icon: <FaGlobe className="text-green-400" />,
    category: "Completed"
  },
  {
    title: "Buddy AI",
    description: "An AI-powered assistant. Currently in development.",
    tags: ["AI", "Assistant", "In Progress"],
    github: "https://github.com/HARSHAN-DEVHUB/Buddy-AI",
    live: null,
    details: "Working on Buddy AI, an AI-powered assistant.",
    icon: <FaCode className="text-purple-400" />,
    category: "In Progress"
  },
  {
    title: "CRYPTO-AI",
    description: "AI-driven experimentation for crypto market analysis.",
    tags: ["Crypto", "AI", "Research"],
    github: "https://github.com/HARSHAN-DEVHUB/CRYPTO-AI",
    live: null,
    details: "Research project focused on AI workflows and crypto market intelligence.",
    icon: <FaDatabase className="text-cyan-400" />,
    category: "Research"
  },
  {
    title: "EA-MT5",
    description: "A professional MetaTrader 5 expert advisor with multi-signal confirmation.",
    tags: ["MQL5", "Trading", "EA"],
    github: "https://github.com/HARSHAN-DEVHUB/EA-MT5",
    live: null,
    details: "Algorithmic trading system implementing trend analysis, pattern recognition, and risk controls.",
    icon: <FaCode className="text-indigo-400" />,
    category: "Completed"
  },
  {
    title: "System Info Gathering",
    description: "A system information gathering tool. Researching improvements.",
    tags: ["System", "Info", "Research"],
    github: "https://github.com/HARSHAN-DEVHUB/sys-info-geathering",
    live: null,
    details: "Researching to improve system information gathering features.",
    icon: <FaDatabase className="text-yellow-400" />,
    category: "Research"
  },
  {
    title: "E-Commerce",
    description: "A completed e-commerce platform.",
    tags: ["E-Commerce", "Platform", "Completed"],
    github: "https://github.com/HARSHAN-DEVHUB/e-commerse",
    live: null,
    details: "E-commerce platform. Project completed.",
    icon: <FaGlobe className="text-pink-400" />,
    category: "Completed"
  },
  {
    title: "Drift",
    description: "Frontend web project deployed on Vercel.",
    tags: ["JavaScript", "Frontend", "Deployed"],
    github: "https://github.com/HARSHAN-DEVHUB/Drift",
    live: "https://drift-sepia.vercel.app",
    details: "JavaScript project with a live deployed experience on Vercel.",
    icon: <FaGlobe className="text-sky-400" />,
    category: "Completed"
  },
  {
    title: "Namakari Kadai",
    description: "Business website project with live deployment.",
    tags: ["JavaScript", "Business", "Deployed"],
    github: "https://github.com/HARSHAN-DEVHUB/namakarikadai",
    live: "https://namakarikadai.vercel.app",
    details: "Web project for a business use case, deployed and publicly accessible.",
    icon: <FaGlobe className="text-emerald-400" />,
    category: "Completed"
  },
  {
    title: "LH-CLOTHING",
    description: "Clothing domain web app repository.",
    tags: ["JavaScript", "Web App", "E-Commerce"],
    github: "https://github.com/HARSHAN-DEVHUB/LH-CLOTHING",
    live: null,
    details: "Web application project in the clothing/e-commerce domain.",
    icon: <FaGlobe className="text-rose-400" />,
    category: "Completed"
  },
  {
    title: "IRIS",
    description: "Python-based ML experimentation repository.",
    tags: ["Python", "Machine Learning", "Data"],
    github: "https://github.com/HARSHAN-DEVHUB/IRIS",
    live: null,
    details: "Machine learning project using Python for model experimentation and analysis.",
    icon: <FaDatabase className="text-violet-400" />,
    category: "Research"
  },
  {
    title: "Limitation of ChatBot",
    description: "Study of chatbot limitations with offline RAG and memory-driven evaluation.",
    tags: ["NLP", "RAG", "Research"],
    github: "https://github.com/HARSHAN-DEVHUB/Limitation-of-ChatBot",
    live: null,
    details: "Research repository exploring hallucinations, context failures, and practical evaluation approaches for chatbots.",
    icon: <FaDatabase className="text-amber-400" />,
    category: "Research"
  },
  {
    title: "Personal Assistant",
    description: "Assistant-oriented project for productivity and automation workflows.",
    tags: ["Assistant", "Automation", "In Progress"],
    github: "https://github.com/HARSHAN-DEVHUB/personal-assistant",
    live: null,
    details: "An assistant-focused repository aimed at task support and workflow automation.",
    icon: <FaCode className="text-teal-400" />,
    category: "In Progress"
  }
];

function toTitleCaseFromSlug(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getProjectIcon(language) {
  const normalized = (language || "").toLowerCase();
  if (["javascript", "typescript", "html", "css"].includes(normalized)) {
    return <FaGlobe className="text-blue-400" />;
  }
  if (["python", "mql5", "shell", "makefile"].includes(normalized)) {
    return <FaCode className="text-purple-400" />;
  }
  return <FaDatabase className="text-cyan-400" />;
}

function getProjectCategory(repo) {
  if (repo.archived) {
    return "Completed";
  }

  const lastPush = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;
  const daysSincePush = (Date.now() - lastPush) / (1000 * 60 * 60 * 24);

  if (daysSincePush <= 120) {
    return "In Progress";
  }

  return "Research";
}

function mapRepoToProject(repo) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const languageTag = repo.language ? [repo.language] : [];
  const defaultTags = languageTag.length ? languageTag : ["Project"];
  const tags = [...new Set([...languageTag, ...topics])].slice(0, 4);

  return {
    title: toTitleCaseFromSlug(repo.name),
    description: repo.description || "GitHub repository from my public profile.",
    tags: tags.length ? tags : defaultTags,
    github: repo.html_url,
    live: repo.homepage || null,
    details:
      repo.description ||
      `Public repository built with ${repo.language || "various technologies"}.`,
    icon: getProjectIcon(repo.language),
    category: getProjectCategory(repo),
  };
}



// Tag color mapping for variety
const tagColors = [
  "from-purple-600 to-indigo-600",
  "from-fuchsia-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-lime-500",
  "from-yellow-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
];

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13 },
  }),
};

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// Pagination settings
const PAGE_SIZE = 6;

function uniqueTags(projects) {
  const tags = new Set();
  projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

function uniqueCategories(projects) {
  const categories = new Set();
  projects.forEach((p) => categories.add(p.category));
  return Array.from(categories);
}

// --- Main Projects Component ---
const Projects = () => {
  // State
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsData, setProjectsData] = useState(fallbackProjects);
  const [isSyncing, setIsSyncing] = useState(true);

  // Auto-sync public repositories from GitHub profile
  useEffect(() => {
    let isMounted = true;

    const fetchGitHubProjects = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();
        const syncedProjects = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .map(mapRepoToProject);

        if (isMounted && syncedProjects.length > 0) {
          setProjectsData(syncedProjects);
        }
      } catch (error) {
        console.error("Failed to sync GitHub repositories:", error);
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    fetchGitHubProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived data
  const tags = useMemo(() => ["All", ...uniqueTags(projectsData)], [projectsData]);
  const categories = useMemo(
    () => ["All", ...uniqueCategories(projectsData)],
    [projectsData]
  );

  // Filtered & searched projects
  const filteredProjects = useMemo(() => {
    let list = projectsData;
    
    // Filter by category
    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    
    // Filter by tag
    if (filter !== "All") {
      list = list.filter((p) => p.tags.includes(filter));
    }
    
    // Filter by search
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          (p.details && p.details.toLowerCase().includes(s)) ||
          p.category.toLowerCase().includes(s)
      );
    }
    return list;
  }, [projectsData, filter, categoryFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Modal keyboard navigation
  const modalRef = useRef();
  useEffect(() => {
    if (selectedProject) {
      const handler = (e) => {
        if (e.key === "Escape") setSelectedProject(null);
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [selectedProject]);

  // Reset filters when changing pages
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, categoryFilter, search]);

  // Animation for tags
  const getTagColor = (idx) => tagColors[idx % tagColors.length];

  // --- 3D Floating Decorative Elements ---
  const floatingBalls = Array.from({ length: 12 }).map((_, i) => ({
    size: Math.random() * 40 + 40,
    top: Math.random() * 80 + 5,
    left: Math.random() * 90 + 2,
    blur: Math.random() > 0.5 ? "blur-md" : "blur-xl",
    color:
      [
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-pink-500",
        "bg-cyan-500",
      ][i % 6],
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 2,
  }));

  return (
    <section id="projects" className="relative py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white min-h-screen overflow-hidden">
      {/* 3D Floating Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {floatingBalls.map((b, i) => (
          <span
            key={i}
            className={`absolute rounded-full opacity-20 ${b.color} ${b.blur}`}
            style={{
              width: b.size,
              height: b.size,
              top: `${b.top}%`,
              left: `${b.left}%`,
              animation: `floaty${i} ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
              zIndex: 0,
            }}
          />
        ))}
        {/* Keyframes for floating balls */}
        <style>
          {floatingBalls
            .map(
              (b, i) =>
                `@keyframes floaty${i} {
                  0% { transform: translateY(0);}
                  100% { transform: translateY(-${Math.floor(b.size / 2)}px);}
                }`
            )
            .join("\n")}
        </style>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Featured Projects
        </motion.h2>

        <div className="text-center mb-8 text-sm text-gray-400">
          {isSyncing
            ? "Syncing projects from GitHub..."
            : `Auto-synced from @${GITHUB_USERNAME} public repositories`}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  categoryFilter === category
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {tags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  filter === tag
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedProjects.map((project, i) => (
            <motion.div
              key={project.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <div className="text-6xl opacity-50">
                    {project.icon}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getTagColor(idx)} text-white`}
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={`${project.github}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                    aria-label="Open README on GitHub"
                  >
                    View Details
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    aria-label="View on GitHub"
                  >
                    <FaGithub />
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                      aria-label="View live demo"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-6 text-gray-400">
          Showing {filteredProjects.length} of {projectsData.length} projects
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {selectedProject.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {selectedProject.title}
                      </h3>
                      <span className="text-sm text-purple-400">
                        {selectedProject.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  {selectedProject.details}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag, idx) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r ${getTagColor(idx)} text-white`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    <FaGithub />
                    View on GitHub
                  </a>
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <FaExternalLinkAlt />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
