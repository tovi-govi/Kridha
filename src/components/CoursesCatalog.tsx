import { Link } from "@tanstack/react-router";
import { Code, Layers, BrainCircuit, Cloud, ShieldCheck, Rocket } from "lucide-react";

type Course = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ElementType;
  topics: string[];
  cta: string;
  isNew?: boolean;
};

const courses: Course[] = [
  {
    number: 1,
    slug: "foundation",
    title: "Foundation",
    subtitle: "Perfect for beginners",
    color: "#7C3AED",
    icon: Code,
    topics: ["Python Programming", "Java Basics", "Data Structures", "Git & Version Control"],
    cta: "Build Strong Programming Basics",
    isNew: false,
  },
  {
    number: 2,
    slug: "full-stack",
    title: "Full Stack Developer",
    subtitle: "End-to-end web apps",
    color: "#2563EB",
    icon: Layers,
    topics: ["Frontend (HTML, CSS, JS, React)", "Backend (Node.js / Java / Python)", "Database (SQL, MongoDB)", "Real-Time Projects"],
    cta: "Become a Complete Developer",
    isNew: true,
  },
  {
    number: 3,
    slug: "ai-data-science",
    title: "AI & Data Science",
    subtitle: "Future-ready skills",
    color: "#059669",
    icon: BrainCircuit,
    topics: ["AI Fundamentals", "Machine Learning", "Data Science", "Data Visualization"],
    cta: "Enter the Future of Technology",
    isNew: true,
  },
  {
    number: 4,
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    subtitle: "Ship and scale",
    color: "#EA580C",
    icon: Cloud,
    topics: ["Cloud (AWS / Azure Basics)", "DevOps Tools", "CI/CD Pipelines", "Docker & Kubernetes"],
    cta: "Deploy & Scale Applications",
    isNew: false,
  },
  {
    number: 5,
    slug: "cyber-security",
    title: "Cyber Security",
    subtitle: "Defend the stack",
    color: "#DC2626",
    icon: ShieldCheck,
    topics: ["Cyber Security Basics", "Ethical Hacking", "IAM & PAM", "Network Security"],
    cta: "Secure the Digital World",
    isNew: false,
  },
  {
    number: 6,
    slug: "advanced-tech",
    title: "Advanced Tech",
    subtitle: "Stay ahead of the curve",
    color: "#7C3AED",
    icon: Rocket,
    topics: ["ServiceNow", "Microsoft Playwright", "Quantum Computing (Intro)"],
    cta: "Stay Ahead in Technology",
    isNew: false,
  },
];

export function CoursesCatalog() {
  return (
    <section id="services" className="py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-600">Our Courses</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">
            Master In-Demand Skills
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose from our carefully designed courses to build your career in tech
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.slug}
              to="/courses"
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-soft transition hover:shadow-glow hover:-translate-y-1 cursor-pointer"
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition"
                style={{ backgroundColor: course.color }}
              ></div>

              {/* Number Badge */}
              <div
                className="absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-white text-lg"
                style={{ backgroundColor: course.color }}
              >
                {course.number}
              </div>

              {/* New Course Badge */}
              {course.isNew && (
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
                  style={{ backgroundColor: course.color }}
                >
                  New Course
                </div>
              )}

              {/* Icon */}
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-xl text-white mb-4"
                style={{ backgroundColor: course.color }}
              >
                <course.icon className="h-7 w-7" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="mt-4 text-xl font-extrabold text-primary">{course.title}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                {course.subtitle}
              </p>

              {/* Topics */}
              <div className="mt-4 space-y-2">
                {course.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span className="text-muted-foreground">{topic}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div
                className="mt-6 w-full py-3 px-4 rounded-full text-center font-extrabold text-white transition group-hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: course.color }}
              >
                {course.cta}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
