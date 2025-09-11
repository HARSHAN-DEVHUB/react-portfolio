import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaReact, FaNodeJs, FaPython, FaDatabase, FaShieldAlt, 
  FaPalette, FaTools, FaServer, FaMobile, FaCloud 
} from "react-icons/fa";
import { SiJavascript, SiTailwindcss, SiFirebase, SiDocker, SiKubernetes } from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: <FaReact className="text-4xl text-blue-400" />,
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "React", level: 95, icon: <FaReact /> },
      { name: "JavaScript", level: 90, icon: <SiJavascript /> },
      { name: "Tailwind CSS", level: 90, icon: <SiTailwindcss /> },
      { name: "HTML/CSS", level: 85, icon: <FaPalette /> },
    ]
  },
  {
    title: "Backend Development",
    icon: <FaServer className="text-4xl text-green-400" />,
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "Node.js", level: 85, icon: <FaNodeJs /> },
      { name: "Python", level: 75, icon: <FaPython /> },
      { name: "Firebase", level: 80, icon: <SiFirebase /> },
      { name: "Databases", level: 70, icon: <FaDatabase /> },
    ]
  },
  {
    title: "Cybersecurity",
    icon: <FaShieldAlt className="text-4xl text-red-400" />,
    color: "from-red-500 to-pink-500",
    skills: [
      { name: "Ethical Hacking", level: 85, icon: <FaShieldAlt /> },
      { name: "VAPT", level: 80, icon: <FaTools /> },
      { name: "Digital Forensics", level: 75, icon: <FaShieldAlt /> },
      { name: "Security Tools", level: 80, icon: <FaTools /> },
    ]
  },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [skillLevels, setSkillLevels] = useState({});

  // Animate skill levels on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = skillCategories[selectedCategory];
            category.skills.forEach((skill) => {
              setTimeout(() => {
                setSkillLevels(prev => ({
                  ...prev,
                  [skill.name]: skill.level
                }));
              }, 100);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('skills-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [selectedCategory]);

  return (
    <section id="skills" className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I specialize in full-stack development with a focus on security. 
            Here's a breakdown of my technical skills and proficiency levels.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillCategories.map((category, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCategory(index)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === index
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              {category.icon}
              {category.title}
            </motion.button>
          ))}
        </div>

        {/* Skills Grid */}
        <div id="skills-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories[selectedCategory].skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="font-bold text-lg text-white">{skill.name}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Proficiency</span>
                  <span className="text-purple-400 font-semibold">
                    {skillLevels[skill.name] || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${skillCategories[selectedCategory].color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skillLevels[skill.name] || 0}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-purple-300 mb-8">Other Skills & Tools</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Git", "Linux", "REST APIs",  "MongoDB", "PostgreSQL", 
                 "Webpack", "Vite", "Nginx", 
              "Metasploit", "Wireshark", "Burp Suite", "Nmap", 
            ].map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm font-medium hover:bg-purple-600/20 hover:text-purple-300 transition-all duration-200 cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 