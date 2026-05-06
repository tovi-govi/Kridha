import { Bookmark, Building2, FileText, Hammer, Mic, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: 1,
    title: "Register / Enroll",
    description: "Begin your journey with us. Quick enrollment process with flexible payment options.",
    icon: <Bookmark className="h-10 w-10 text-emerald-300" />,
  },
  {
    number: 2,
    title: "Skill Training",
    description: "Intensive 6-month program with live projects, real-time problem solving, and industry mentors.",
    icon: <Hammer className="h-10 w-10 text-cyan-300" />,
  },
  {
    number: 3,
    title: "Resume Preparation",
    description: "Professional resume crafting to highlight your skills, projects, and achievements effectively.",
    icon: <FileText className="h-10 w-10 text-sky-300" />,
  },
  {
    number: 4,
    title: "Mock Interviews",
    description: "Practice interviews with industry experts to build confidence and perfect your communication.",
    icon: <Mic className="h-10 w-10 text-violet-300" />,
  },
  {
    number: 5,
    title: "Company Interviews",
    description: "Direct placement assistance with top companies actively looking for trained candidates.",
    icon: <Building2 className="h-10 w-10 text-emerald-300" />,
  },
  {
    number: 6,
    title: "Job Offer",
    description: "Secure your dream job with competitive salary and growth opportunities.",
    icon: <Target className="h-10 w-10 text-emerald-300" />,
  },
];

export function PlacementProcess() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-3 py-12 sm:px-5 lg:px-8 lg:py-20"
    >
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-400">
          Journey to Success
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          Your Placement Process
        </h2>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-300">
          Follow our proven 6-step process to land your dream job
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-slate-700/40 bg-slate-900/95 p-4 sm:p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(16,185,129,0.18)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${idx * 70}ms`, willChange: "transform, opacity" }}
          >
            <div className="absolute inset-x-4 sm:inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-30" />
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-5 pt-4 sm:pt-6">
              <div
                className="relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-lg sm:rounded-[22px] border border-emerald-400/20 bg-slate-950/95 p-3 sm:p-4 shadow-[0_12px_40px_rgba(16,185,129,0.1)] transition duration-300 group-hover:scale-105"
                style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
              >
                <div className="absolute inset-0 rounded-lg sm:rounded-[22px] bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10 opacity-80 blur-sm" />
                <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-slate-900 text-emerald-300 shadow-lg shadow-emerald-500/20">
                  {step.icon}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 px-1 sm:px-2">
                <span className="inline-flex rounded-full bg-emerald-500/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-emerald-200">
                  Step {step.number}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-slate-300">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-5 sm:p-8 lg:p-12 text-center text-white shadow-[0_25px_90px_rgba(15,23,42,0.3)]">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 flex-shrink-0" />
          <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-snug">
            Ready to start your journey?
          </h3>
        </div>
        <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-300">
          Join our next batch and become job-ready in 6 months
        </p>
        <a
          href="#book"
          className="mt-4 sm:mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:scale-[1.03] hover:bg-emerald-300 active:scale-95 touch-target"
        >
          Book Free Demo Today
        </a>
      </div>
    </section>
  );
}
