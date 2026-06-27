"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  {
    value: 3,
    suffix: "+",
    label: "Certifications",
    description: "React, Cybersec & Crypto",
  },
  {
    value: 5,
    suffix: "+",
    label: "Early Beta Users",
    description: "DayLens habit tracker feedback",
  },
  {
    value: 4,
    suffix: "+",
    label: "Languages & Frameworks",
    description: "React, C++, TypeScript, Python",
  },
  {
    value: 1,
    suffix: "yr+",
    label: "AI/ML Focus Work",
    description: "Neural Nets & real-world apps",
  },
];

const awards = [
  { name: "Frontend Developer (React)", count: "SIT", year: "2025" },
  { name: "AtomQuest 2025 Achiever", count: "Atom", year: "2025" },
  { name: "Introduction to Dark Web, Anonymity & Crypto", count: "Cert", year: "2024" },
];

export default function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Dynamic GitHub sync states
  const [gitSkills, setGitSkills] = useState<string[]>([]);
  const [gitLanguages, setGitLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const res = await fetch("https://api.github.com/users/Praz-ctrl/repos");
        if (!res.ok) throw new Error("API Limit or offline");
        const data = await res.json();

        // 1. Extract unique topics/tags (excluding personal name keys)
        const topics = new Set<string>();
        // 2. Count language occurrences
        const languages = new Set<string>();

        data.forEach((repo: any) => {
          if (repo.language) {
            languages.add(repo.language);
          }
          if (repo.topics && Array.isArray(repo.topics)) {
            repo.topics.forEach((topic: string) => {
              // clean names
              const cleanTopic = topic.replace(/-/g, " ");
              if (cleanTopic !== "praz ctrl") {
                topics.add(cleanTopic);
              }
            });
          }
        });

        // If no topics are configured on GitHub repositories, fall back to default skills
        if (topics.size === 0) {
          ["react", "nextjs", "typescript", "c++", "machine learning", "neural networks", "cyber security", "data science"].forEach(t => topics.add(t));
        }
        // If no languages are configured, fall back to core languages
        if (languages.size === 0) {
          ["TypeScript", "C++", "JavaScript", "Python"].forEach(l => languages.add(l));
        }

        setGitSkills(Array.from(topics).slice(0, 12)); // cap at 12 topics
        setGitLanguages(Array.from(languages).slice(0, 5)); // cap at 5 languages
      } catch (err) {
        // Safe fallbacks in case of offline/GitHub API limits
        setGitSkills(["react", "nextjs", "typescript", "tailwind css", "machine learning", "neural networks", "c++", "cyber security"]);
        setGitLanguages(["TypeScript", "C++", "JavaScript", "Python"]);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12"
      id="awards"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-section" />

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <motion.span
            className="text-label block mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Credentials
          </motion.span>
          <motion.h2
            className="text-display-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Certifications & <span className="text-[#c9a96e] italic">Skills</span>
          </motion.h2>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24 md:mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard className="p-6 md:p-8 h-full">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#c9a96e] block mb-3"
                  duration={2.5}
                />
                <p className="text-sm font-medium text-[#fafafa] mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-[#525252]">{stat.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: Certifications + Dynamic GitHub Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Left Column: Certifications */}
          <div className="lg:col-span-7">
            <span className="text-label block mb-8">Professional Certifications</span>
            <div className="space-y-0">
              {awards.map((award, i) => (
                <motion.div
                  key={award.name}
                  className="group flex items-center justify-between py-6 border-b border-b-[rgba(255,255,255,0.06)] hover:border-b-[rgba(201,169,110,0.2)] transition-colors duration-500"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="flex items-center gap-6 md:gap-8">
                    <span className="text-xs text-[#525252] tabular-nums w-8">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <h4 className="text-base md:text-lg font-medium tracking-[-0.01em] text-[#fafafa] group-hover:text-[#c9a96e] transition-colors duration-300">
                      {award.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-6 md:gap-8">
                    <span className="text-sm font-bold text-[#c9a96e]">
                      {award.count}
                    </span>
                    <span className="text-xs text-[#525252] hidden md:block">
                      {award.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Live Sync Skills */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-label block mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                GitHub Live Skill Sync
              </span>
              <p className="text-xs text-[#525252] mb-8 font-mono">
                Real-time skills synced directly from Praz-ctrl public repo topics & tags.
              </p>

              {loading ? (
                <div className="flex items-center gap-2 font-mono text-xs text-[#525252] h-20 animate-pulse">
                  Connecting to GitHub API...
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Topics Chips */}
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.15em] text-[#737373] mb-4 font-mono">Repo Topics</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {gitSkills.map((topic, i) => (
                        <motion.span
                          key={topic}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-[0.65rem] font-mono tracking-wider uppercase px-3 py-1.5 rounded-md border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] hover:border-[#c9a96e]/30 hover:bg-[rgba(201,169,110,0.05)] text-[#fafafa] hover:text-[#c9a96e] transition-all duration-300 select-none cursor-default"
                        >
                          # {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Top Languages */}
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.15em] text-[#737373] mb-4 font-mono">Synced Languages</h4>
                    <div className="flex flex-wrap gap-3">
                      {gitLanguages.map((lang) => (
                        <span 
                          key={lang}
                          className="text-xs font-semibold text-[#fafafa] flex items-center gap-2 border border-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full bg-[rgba(255,255,255,0.01)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.04)] text-[0.65rem] text-[#525252] font-mono leading-relaxed">
              *Whenever a new repository is pushed, tagged, or updated on GitHub, this block updates automatically on reload.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
