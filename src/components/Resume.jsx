import { useState } from "react";
import { motion } from "framer-motion";

const educationData = [
  {
    degree: "Bachelor of Computer Science (CTIS)",
    institution: "Rathinam College",
    year: "2021 - 2024",
    score: "8.17/10",
    status: null,
  },
  {
    degree: "Masters Of Science Information Systems",
    institution: "University Of Portsmouth, United Kingdom",
    year: "2024 - Now",
    score: null,
    status: "Pursuing",
  },
];

const experienceData = [
  {
    title: "Coimbatore Cyber Crime Officer",
    company: "",
    year: "2021 - Now",
    rating: "4.90/5",
    description:
      "Took care of cyber crime records and handling cases. Took part in real time cases and solved.",
  },
  {
    title: "Front-End Developer, Programmer",
    company: "Freelancer",
    year: "2021 - Now",
    rating: "5.00/5",
    description:
      "My responsibility was to Optimize the user experience. Using HTML, JavaScript and CSS to bring concepts to life. Developing and maintaining the user interface. Implementing design on mobile websites...",
  },
];

const techSkills = [
  { name: "METADATA ANALYST", percent: 50 },
  { name: "LINUX", percent: 95 },
  { name: "METASPLOIT", percent: 75 },
  { name: "ETHICAL HACKING", percent: 80 },
  { name: "PENETRATION TESTING", percent: 60 },
  { name: "WEB SCANNING", percent: 85 },
  { name: "MSFVENOM", percent: 90 },
];

const devSkills = [
  { name: "HTML", percent: 85 },
  { name: "CSS", percent: 80 },
  { name: "JAVASCRIPT", percent: 90 },
];

const tabs = ["Education", "Professional Skills", "Experience"];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13 },
  }),
};

export default function Resume() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto" id="resume">
      <div className="flex justify-center gap-4 mb-10">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-3 rounded-t-lg font-semibold text-lg transition-all duration-200 focus:outline-none ${
              activeTab === idx
                ? "bg-gray-900 text-fuchsia-400 shadow-lg"
                : "bg-gray-800 text-gray-300 hover:text-fuchsia-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        className="bg-gray-900/80 rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        key={activeTab}
      >
        {activeTab === 0 && (
          <div>
            <motion.h2
              className="text-3xl font-bold mb-8 text-fuchsia-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Education Quality
            </motion.h2>
            <div className="space-y-8">
              {educationData.map((edu, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-800 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center justify-between"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                >
                  <div>
                    <motion.div
                      className="text-xl font-semibold text-white mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      {edu.degree}
                    </motion.div>
                    <div className="text-gray-400 text-sm mb-1">{edu.institution} <span className="ml-2 text-xs text-fuchsia-400">({edu.year})</span></div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    {edu.score && (
                      <motion.span
                        className="bg-gray-900 text-pink-400 px-4 py-1 rounded-lg font-bold shadow"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      >
                        {edu.score}
                      </motion.span>
                    )}
                    {edu.status && (
                      <motion.span
                        className="bg-gray-900 text-pink-400 px-4 py-1 rounded-lg font-bold shadow"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      >
                        {edu.status}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <motion.h2
              className="text-3xl font-bold mb-8 text-fuchsia-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Professional Skills
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Technical Skill</h3>
                {techSkills.map((skill, i) => (
                  <motion.div key={i} className="mb-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: i * 0.08 }} viewport={{ once: true }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                      <span className="text-pink-400 text-xs font-bold">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percent}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                        viewport={{ once: true }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Development Skill</h3>
                {devSkills.map((skill, i) => (
                  <motion.div key={i} className="mb-4" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: i * 0.08 }} viewport={{ once: true }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                      <span className="text-pink-400 text-xs font-bold">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percent}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                        viewport={{ once: true }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <motion.h2
              className="text-3xl font-bold mb-8 text-fuchsia-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Work Experience
            </motion.h2>
            <div className="space-y-8">
              {experienceData.map((exp, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-800 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center justify-between"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                >
                  <div>
                    <motion.div
                      className="text-xl font-semibold text-white mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      {exp.title}
                    </motion.div>
                    <div className="text-gray-400 text-sm mb-1">{exp.company && <span>{exp.company} | </span>}{exp.year}</div>
                    <motion.div
                      className="text-gray-300 text-sm mt-2 max-w-xl"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                    >
                      {exp.description}
                    </motion.div>
                  </div>
                  <motion.span
                    className="bg-gray-900 text-pink-400 px-4 py-1 rounded-lg font-bold shadow mt-2 md:mt-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  >
                    {exp.rating}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
} 