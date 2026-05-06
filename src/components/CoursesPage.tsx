import { useState } from "react";
import { Code, Layers, BrainCircuit, Cloud, ShieldCheck, Rocket, X, ArrowRight, ChevronDown } from "lucide-react";

const courses = [
  {
    slug: "foundation",
    title: "Foundation",
    subtitle: "Perfect for beginners",
    color: "#7C3AED",
    lightColor: "#EDE9FE",
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
    mentor: { name: "Ravi Kumar", exp: "8 years", company: "Ex-TCS, Infosys", img: "RK" },
    outcomes: ["Strong programming foundation", "Ready for advanced tracks", "Industry certification"],
  },
  {
    slug: "full-stack",
    title: "Full Stack",
    subtitle: "End-to-end web apps",
    color: "#2563EB",
    lightColor: "#DBEAFE",
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
    mentor: { name: "Priya Sharma", exp: "10 years", company: "Ex-Amazon, Wipro", img: "PS" },
    outcomes: ["Full stack job-ready", "4 portfolio projects", "Placement support"],
  },
  {
    slug: "ai-data-science",
    title: "AI & Data Science",
    subtitle: "Future-ready skills",
    color: "#059669",
    lightColor: "#D1FAE5",
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
    projects: ["Sentiment Analyzer", "Stock Price Predictor", "Image Classifier", "Recommendation Engine"],
    mentor: { name: "Arjun Mehta", exp: "12 years", company: "Ex-Google, Microsoft", img: "AM" },
    outcomes: ["AI/ML engineer ready", "Kaggle competition ready", "Industry certification"],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    subtitle: "Ship and scale",
    color: "#EA580C",
    lightColor: "#FFEDD5",
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
    mentor: { name: "Suresh Babu", exp: "9 years", company: "Ex-Accenture, AWS", img: "SB" },
    outcomes: ["AWS/Azure certified", "DevOps engineer ready", "Placement support"],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    subtitle: "Defend the stack",
    color: "#DC2626",
    lightColor: "#FEE2E2",
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
    mentor: { name: "Kavya Reddy", exp: "11 years", company: "Ex-IBM, Deloitte", img: "KR" },
    outcomes: ["CEH certification ready", "Security analyst ready", "Placement support"],
  },
  {
    slug: "advanced-tech",
    title: "Advanced Tech",
    subtitle: "Stay ahead of the curve",
    color: "#4F6FA5",
    lightColor: "#DBEAFE",
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
    mentor: { name: "Vikram Nair", exp: "15 years", company: "Ex-ServiceNow, IBM", img: "VN" },
    outcomes: ["Niche tech expertise", "High-demand skills", "Industry certification"],
  },
];

export function CoursesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient py-12 px-5 text-center" style={{ colorScheme: "normal" }}>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white">Our Courses</h1>
        <p className="mt-3 text-white/70 text-lg">Click a track to explore the full details</p>
      </div>

      {/* Accordion rows */}
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 py-8 space-y-4">
        {courses.map((c) => {
          const isActive = active === c.slug;
          const Icon = c.icon;
          return (
            <div key={c.slug} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Row header - always visible */}
              <button
                onClick={() => setActive(isActive ? null : c.slug)}
                className="w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-300"
                style={{ backgroundColor: c.color }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/25 grid place-items-center shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-lg">{c.title}</div>
                    <div className="text-white/80 text-sm">{c.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-2">
                    <span className="rounded-full bg-white/25 text-white text-xs font-semibold px-3 py-1.5">{c.duration}</span>
                    <span className="rounded-full bg-white/30 text-white text-xs font-bold px-3 py-1.5">⚡ {c.seats}</span>
                  </div>
                  <ChevronDown
                    className="h-5 w-5 text-white transition-transform duration-300"
                    style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>
              </button>

              {/* Expanded content */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: isActive ? "1200px" : "0px" }}
              >
                <div className="bg-background p-6 lg:p-8 border-t-4" style={{ borderTopColor: c.color }}>
                  {/* Mobile stats */}
                  <div className="flex sm:hidden gap-2 mb-5 flex-wrap">
                    <span className="rounded-full text-white text-xs font-semibold px-3 py-1.5" style={{ backgroundColor: c.color }}>{c.duration}</span>
                    <span className="rounded-full text-white text-xs font-semibold px-3 py-1.5" style={{ backgroundColor: c.color }}>{c.fee}</span>
                    <span className="rounded-full text-white text-xs font-bold px-3 py-1.5" style={{ backgroundColor: c.color }}>⚡ {c.seats}</span>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Syllabus */}
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: c.color }}>Syllabus</h3>
                      <div className="space-y-2">
                        {c.syllabus.map((s) => (
                          <div key={s.module} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                            <div>
                              <span className="font-semibold">{s.module}</span>
                              <span className="text-muted-foreground"> · {s.topic}</span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">{s.weeks}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects + Mentor */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: c.color }}>Projects You'll Build</h3>
                        <div className="flex flex-wrap gap-2">
                          {c.projects.map((p) => (
                            <span key={p} className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: c.color }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                    </div>

                    {/* Outcomes + CTA */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: c.color }}>What You'll Achieve</h3>
                        <ul className="space-y-2">
                          {c.outcomes.map((o) => (
                            <li key={o} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: c.color }} />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">📅 {c.batch}</div>
                        <a
                          href="/#book"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold text-white transition hover:opacity-90"
                          style={{ backgroundColor: c.color }}
                        >
                          Book Free Demo <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}