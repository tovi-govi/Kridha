import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Cloud,
  Code,
  Layers,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Motion";

const courses = [
  {
    slug: "foundation",
    title: "Foundation",
    subtitle: "Perfect for beginners",
    color: "#7C3AED",
    icon: Code,
    duration: "1 Month",
    fee: "₹15,000",
    batch: "Starting June 2026",
    seats: "20 seats left",
    syllabus: [
      { module: "Module 1", topic: "Python Programming", weeks: "2 weeks" },
      { module: "Module 2", topic: "Java Basics", weeks: "2 weeks" },
      { module: "Module 3", topic: "Data Structures & Algorithms", weeks: "4 weeks" },
      { module: "Module 4", topic: "Git & Version Control", weeks: "2 weeks" },
    ],
    projects: ["CLI Task Manager", "Student Grade Calculator", "Mini Bank System"],
    outcomes: [
      "Strong programming foundation",
      "Ready for advanced tracks",
      "Industry certification",
    ],
  },
  {
    slug: "full-stack",
    title: "Full Stack",
    subtitle: "End-to-end web apps",
    color: "#2563EB",
    icon: Layers,
    duration: "1 Month",
    fee: "₹35,000",
    batch: "Starting June 2026",
    seats: "12 seats left",
    syllabus: [
      { module: "Module 1", topic: "HTML, CSS & JavaScript", weeks: "4 weeks" },
      { module: "Module 2", topic: "React & Frontend Dev", weeks: "4 weeks" },
      { module: "Module 3", topic: "Node.js & Backend", weeks: "4 weeks" },
      { module: "Module 4", topic: "Database (SQL + MongoDB)", weeks: "3 weeks" },
      { module: "Module 5", topic: "Real-Time Projects", weeks: "5 weeks" },
    ],
    projects: ["E-Commerce Website", "Chat Application", "Job Portal", "Portfolio Builder"],
    outcomes: ["Full stack job-ready", "4 portfolio projects", "Placement support"],
  },
  {
    slug: "ai-data-science",
    title: "AI & Data Science",
    subtitle: "Future-ready skills",
    color: "#059669",
    icon: BrainCircuit,
    duration: "1 Month",
    fee: "₹35,000",
    batch: "Starting June 2026",
    seats: "15 seats left",
    syllabus: [
      { module: "Module 1", topic: "Python for Data Science", weeks: "3 weeks" },
      { module: "Module 2", topic: "Machine Learning", weeks: "5 weeks" },
      { module: "Module 3", topic: "Deep Learning & AI", weeks: "4 weeks" },
      { module: "Module 4", topic: "Data Visualization", weeks: "3 weeks" },
      { module: "Module 5", topic: "Capstone Project", weeks: "5 weeks" },
    ],
    projects: [
      "Sentiment Analyzer",
      "Stock Price Predictor",
      "Image Classifier",
      "Recommendation Engine",
    ],
    outcomes: ["AI/ML engineer ready", "Kaggle competition ready", "Industry certification"],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    subtitle: "Ship and scale",
    color: "#EA580C",
    icon: Cloud,
    duration: "1 Month",
    fee: "₹35,000",
    batch: "Starting July 2026",
    seats: "18 seats left",
    syllabus: [
      { module: "Module 1", topic: "Cloud Fundamentals (AWS/Azure)", weeks: "4 weeks" },
      { module: "Module 2", topic: "Linux & Networking", weeks: "3 weeks" },
      { module: "Module 3", topic: "Docker & Kubernetes", weeks: "4 weeks" },
      { module: "Module 4", topic: "CI/CD Pipelines", weeks: "4 weeks" },
      { module: "Module 5", topic: "Live Infrastructure Project", weeks: "5 weeks" },
    ],
    projects: ["Deploy a Scalable App", "Build CI/CD Pipeline", "Kubernetes Cluster Setup"],
    outcomes: ["AWS/Azure certified", "DevOps engineer ready", "Placement support"],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    subtitle: "Defend the stack",
    color: "#DC2626",
    icon: ShieldCheck,
    duration: "1 Month",
    fee: "₹35,000",
    batch: "Starting July 2026",
    seats: "10 seats left",
    syllabus: [
      { module: "Module 1", topic: "Cyber Security Basics", weeks: "3 weeks" },
      { module: "Module 2", topic: "Ethical Hacking", weeks: "5 weeks" },
      { module: "Module 3", topic: "IAM & PAM", weeks: "3 weeks" },
      { module: "Module 4", topic: "Network Security", weeks: "4 weeks" },
      { module: "Module 5", topic: "CTF Challenges & Live Labs", weeks: "5 weeks" },
    ],
    projects: ["Penetration Testing Report", "Build a Firewall", "Vulnerability Scanner"],
    outcomes: ["CEH certification ready", "Security analyst ready", "Placement support"],
  },
  {
    slug: "advanced-tech",
    title: "Advanced Tech",
    subtitle: "Stay ahead of the curve",
    color: "#4F6FA5",
    icon: Rocket,
    duration: "1 Month",
    fee: "₹20,000",
    batch: "Starting August 2026",
    seats: "25 seats left",
    syllabus: [
      { module: "Module 1", topic: "ServiceNow Development", weeks: "4 weeks" },
      { module: "Module 2", topic: "Microsoft Playwright", weeks: "4 weeks" },
      { module: "Module 3", topic: "Quantum Computing Intro", weeks: "4 weeks" },
    ],
    projects: ["ServiceNow ITSM App", "Automated Test Suite", "Quantum Algorithm Demo"],
    outcomes: ["Niche tech expertise", "High-demand skills", "Industry certification"],
  },
];

export function CoursesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-hero-gradient px-5 py-12 text-center"
        style={{ colorScheme: "normal" }}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">Our Courses</h1>
          <p className="mt-3 text-lg text-white/70">Click a track to explore the full details</p>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-5 lg:px-8">
        {courses.map((c, idx) => {
          const isActive = active === c.slug;
          const Icon = c.icon;

          return (
            <Reveal key={c.slug} delay={idx * 0.055} y={24}>
              <div className="overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <button
                  onClick={() => setActive(isActive ? null : c.slug)}
                  className="w-full px-6 py-5 text-left transition-all duration-300"
                  style={{ backgroundColor: c.color }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/25">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-extrabold text-white">{c.title}</div>
                        <div className="text-sm text-white/80">{c.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden gap-2 sm:flex">
                        <span className="rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold text-white">
                          {c.duration}
                        </span>
                        <span className="rounded-full bg-white/30 px-3 py-1.5 text-xs font-bold text-white">
                          {c.fee}
                        </span>
                        <span className="rounded-full bg-white/30 px-3 py-1.5 text-xs font-bold text-white">
                          {c.seats}
                        </span>
                      </div>
                      <ChevronDown
                        className="h-5 w-5 text-white transition-transform duration-300"
                        style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </div>
                  </div>
                </button>

                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="border-t-4 bg-background p-6 lg:p-8"
                      style={{ borderTopColor: c.color }}
                    >
                      <div className="mb-5 flex flex-wrap gap-2 sm:hidden">
                        <span
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.duration}
                        </span>
                        <span
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.fee}
                        </span>
                        <span
                          className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.seats}
                        </span>
                      </div>

                      <div className="grid gap-8 lg:grid-cols-3">
                        <div>
                          <h3
                            className="mb-3 text-sm font-bold uppercase tracking-wider"
                            style={{ color: c.color }}
                          >
                            Syllabus
                          </h3>
                          <div className="space-y-2">
                            {c.syllabus.map((s) => (
                              <div
                                key={s.module}
                                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                              >
                                <div>
                                  <span className="font-semibold">{s.module}</span>
                                  <span className="text-muted-foreground"> - {s.topic}</span>
                                </div>
                                <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                                  {s.weeks}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3
                            className="mb-3 text-sm font-bold uppercase tracking-wider"
                            style={{ color: c.color }}
                          >
                            Projects You'll Build
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {c.projects.map((p) => (
                              <span
                                key={p}
                                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{ backgroundColor: c.color }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3
                              className="mb-3 text-sm font-bold uppercase tracking-wider"
                              style={{ color: c.color }}
                            >
                              What You'll Achieve
                            </h3>
                            <ul className="space-y-2">
                              {c.outcomes.map((o) => (
                                <li key={o} className="flex items-center gap-2 text-sm">
                                  <ArrowRight
                                    className="h-3.5 w-3.5 shrink-0"
                                    style={{ color: c.color }}
                                  />
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-muted-foreground">{c.batch}</div>
                            <motion.a
                              href="/#book"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold text-white transition hover:opacity-90"
                              style={{ backgroundColor: c.color }}
                            >
                              Book Free Demo <ArrowRight className="h-4 w-4" />
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
