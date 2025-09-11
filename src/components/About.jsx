import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBug, FaCertificate, FaUserShield, FaGraduationCap, FaChartLine, FaCode } from "react-icons/fa";

const skills = [
  { name: "React", level: 95 },
  { name: "JavaScript", level: 90 },
  { name: "Tailwind CSS", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "Linux", level: 80 },
  { name: "Ethical Hacking", level: 85 },
  { name: "Firebase", level: 80 },
  { name: "Python", level: 75 },
];

const timeline = [
  {
    year: "2024",
    title: "UI/UX & Product Design",
    detail: "Designed and developed the Easybux portal. Specialized in branding and digital product design.",
    icon: <FaUserShield className="text-purple-400" />,
  },
  {
    year: "2023",
    title: "Cybercrime & VAPT",
    detail: "Led real-time cybercrime cases and advanced skills in VAPT and forensics.",
    icon: <FaBug className="text-pink-400" />,
  },
  {
    year: "2022",
    title: "Certifications & Competitions",
    detail: "Earned cybersecurity certs and participated in national competitions.",
    icon: <FaCertificate className="text-yellow-300" />,
  },
];

const education = [
  {
    degree: "B.Sc. Computer Science",
    place: "Sample University",
    year: "2018 – 2022",
    detail: "Focus: cybersecurity, web dev, digital forensics.",
    icon: <FaGraduationCap className="text-indigo-400" />,
  },
];

const floatingIcons = [
  { icon: <FaChartLine />, style: "top-8 left-4 text-yellow-400 animate-float" },
  { icon: <FaCode />, style: "top-1/2 left-0 text-fuchsia-400 animate-float2" },
  { icon: <FaBug />, style: "bottom-8 right-6 text-pink-500 animate-float3" },
];

export default function About() {
  const [skillPercents, setSkillPercents] = useState(skills.map(() => 0));
  useEffect(() => {
    let raf;
    const animate = () => {
      setSkillPercents((prev) =>
        prev.map((val, i) =>
          val < skills[i].level ? Math.min(val + 1, skills[i].level) : val
        )
      );
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="about" className="py-24 bg-gray-950 text-white relative overflow-hidden">
      {/* Floating icons */}
      {floatingIcons.map((f, i) => (
        <div key={i} className={`pointer-events-none absolute z-0 opacity-30 text-4xl ${f.style}`}>
          {f.icon}
        </div>
      ))}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/10 mb-12"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-3">About Me</h2>
          <p className="text-gray-300 mb-2">
            I’m Harshan, a creative developer & ethical hacker with a passion for secure, beautiful digital experiences. I blend frontend, backend, and cybersecurity to craft solutions that are both elegant and robust. Always learning, always building!
          </p>
          <p className="text-gray-300 mb-2">
            My journey began with a fascination for how things work—whether it was computers, networks, or the logic behind secure systems. This curiosity led me to pursue formal education in computer science and information systems, where I honed my skills in both software development and cybersecurity.
          </p>
          <p className="text-gray-300 mb-2">
            I believe that technology should empower people and protect their privacy. My philosophy is to build applications that are not only visually stunning and user-friendly, but also resilient against threats. I thrive at the intersection of design, code, and security, and I’m always eager to tackle new challenges—whether it’s building a modern web app, automating a workflow, or securing a digital asset.
          </p>
          <p className="text-gray-300 mb-2">
            I have hands-on experience in React, Node.js, Linux, penetration testing, and UI/UX design. I’ve contributed to open-source projects, led cybercrime investigations, and collaborated with teams across the globe. My unique blend of technical depth and creative vision allows me to see the big picture while sweating the details.
          </p>
          <p className="text-fuchsia-300 font-semibold">
            I am also a trader who actively trades <span className="text-yellow-400">XAUUSD</span> and <span className="text-blue-400">EURUSD</span> in the financial markets.
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-purple-300 mb-6">Journey</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-purple-500/20 z-0"></div>
            <div className="flex justify-between relative z-10">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center w-[30%]"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 border-2 border-purple-500 shadow mb-2">
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{item.year}</div>
                    <div className="text-lg font-semibold text-white">{item.title}</div>
                    <div className="text-gray-300 text-sm">{item.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-20px);} }
        @keyframes float2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(12px);} }
        @keyframes float3 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float2 { animation: float2 7s ease-in-out infinite; }
        .animate-float3 { animation: float3 8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
