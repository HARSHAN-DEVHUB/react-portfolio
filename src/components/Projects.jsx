import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaShieldAlt,
  FaGlobe,
  FaCode,
  FaDatabase,
} from "react-icons/fa";

const projects = [
  {
    title: "Official Portfolio",
    description: "A modern, responsive portfolio website showcasing my skills in React, Tailwind CSS, and web development.",
    images: ["/assets/portfolio.png", "/assets/portfolio2.png"],
    tags: ["React", "Tailwind CSS", "JavaScript", "Vite"],
    github: "https://github.com/HARSHAN-ASMODAY/Official-portfolio",
    live: "https://harshan-portfolio.vercel.app",
    details:
      "A professional portfolio website built with modern web technologies. Features smooth animations, responsive design, and interactive components. Includes sections for projects, skills, about, and contact with a functional contact form.",
    icon: <FaGlobe className="text-blue-400" />,
    category: "Web Development"
  },
  {
    title: "Time Line Series",
    description: "A Python application for analyzing and visualizing time series data with advanced statistical methods.",
    images: ["/assets/timeline.png"],
    tags: ["Python", "Data Analysis", "Statistics", "Visualization"],
    github: "https://github.com/HARSHAN-ASMODAY/time-line-series",
    live: null,
    details:
      "A comprehensive time series analysis tool built in Python. Features data preprocessing, statistical analysis, trend detection, and interactive visualizations. Useful for financial data analysis, forecasting, and pattern recognition.",
    icon: <FaCode className="text-green-400" />,
    category: "Data Science"
  },
  {
    title: "Web Scanner",
    description: "A cybersecurity tool for web application vulnerability scanning and security assessment.",
    images: ["/assets/webscanner.png"],
    tags: ["Python", "Cybersecurity", "Web Security", "Penetration Testing"],
    github: "https://github.com/HARSHAN-ASMODAY/WebScaner",
    live: null,
    details:
      "An automated web application security scanner designed for ethical hacking and penetration testing. Features include SQL injection detection, XSS vulnerability scanning, directory enumeration, and security report generation.",
    icon: <FaShieldAlt className="text-red-400" />,
    category: "Cybersecurity"
  },
  {
    title: "System Information Gathering",
    description: "A Python tool for comprehensive system reconnaissance and information collection.",
    images: ["/assets/systeminfo.png"],
    tags: ["Python", "System Administration", "Information Gathering", "Security"],
    github: "https://github.com/HARSHAN-ASMODAY/System-information-geathering",
    live: null,
    details:
      "A system reconnaissance tool that collects detailed information about target systems. Features include OS detection, service enumeration, network scanning, and detailed system profiling for security assessments.",
    icon: <FaDatabase className="text-purple-400" />,
    category: "Cybersecurity"
  },
  {
    title: "Cafe Billing System",
    description: "A web-based billing and inventory management system for cafes and restaurants.",
    images: ["/assets/cafe-billing.png"],
    tags: ["HTML", "CSS", "JavaScript", "Billing System"],
    github: "https://github.com/HARSHAN-ASMODAY/cafe-billing-system",
    live: null,
    details:
      "A complete billing and inventory management solution for food service businesses. Features include menu management, order processing, billing, inventory tracking, and sales reporting with a user-friendly interface.",
    icon: <FaGlobe className="text-orange-400" />,
    category: "Web Development"
  },
  {
    title: "WPDAM Week 2 Project",
    description: "A web development project demonstrating modern HTML and CSS techniques.",
    images: ["/assets/wpdam.png"],
    tags: ["HTML", "CSS", "Web Design", "Responsive"],
    github: "https://github.com/HARSHAN-ASMODAY/WPDAM-WEEK-2",
    live: null,
    details:
      "A responsive web design project showcasing modern HTML5 and CSS3 techniques. Features semantic markup, flexbox layouts, CSS Grid, and mobile-first responsive design principles.",
    icon: <FaCode className="text-indigo-400" />,
    category: "Web Development"
  }
];

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
  const [modalImgIdx, setModalImgIdx] = useState(0);

  // Derived data
  const tags = useMemo(() => ["All", ...uniqueTags(projects)], [projects]);
  const categories = useMemo(() => ["All", ...uniqueCategories(projects)], [projects]);

  // Filtered & searched projects
  const filteredProjects = useMemo(() => {
    let list = projects;
    
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
  }, [filter, categoryFilter, search]);

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
        if (e.key === "ArrowLeft") setModalImgIdx((idx) => Math.max(0, idx - 1));
        if (e.key === "ArrowRight")
          setModalImgIdx((idx) =>
            Math.min(selectedProject.images.length - 1, idx + 1)
          );
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [selectedProject]);

  // Reset image index on modal open
  useEffect(() => {
    setModalImgIdx(0);
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
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                  >
                    View Details
                  </button>
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
          Showing {filteredProjects.length} of {projects.length} projects
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
